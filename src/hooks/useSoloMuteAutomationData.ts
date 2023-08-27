import { MixerMachineContext } from "@/context/MixerMachineContext";
import { useRef, useEffect } from "react";
import { ToneEvent, Loop, Transport as t } from "tone";
import { roundFourth } from "@/utils";
import { useLiveQuery } from "dexie-react-hooks";
import { DexieDb, db } from "@/db";

type Props = { trackId: number; channels: Channel[] };

type WriteProps = {
  id: number;
  value: SoloMuteType;
};

type SoloMuteType = {
  solo: boolean;
  mute: boolean;
};

function useAutomationData({ trackId, channels }: Props) {
  const value: SoloMuteType = MixerMachineContext.useSelector((state) => {
    return state.context.currentTracks[trackId].soloMute;
  });

  // !!! --- WRITE --- !!! //
  useWrite({
    id: trackId,
    value,
  });

  // !!! --- READ --- !!! //
  useRead({ trackId, channels });

  return null;
}

const data = new Map<number, object>();

// !!! --- WRITE --- !!! //
function useWrite({ id, value }: WriteProps) {
  const writeLoop = useRef<Loop | null>(null);
  const playbackMode = MixerMachineContext.useSelector(
    (state) =>
      state.context["currentTracks"][id][`soloMuteMode` as keyof TrackSettings]
  );

  useEffect(() => {
    if (playbackMode !== "write") return;
    writeLoop.current = new Loop(() => {
      const time: number = roundFourth(t.seconds);
      data.set(time, { id, time, value });
      // console.log("data", data);
      db[`soloMuteData` as keyof typeof db].put({
        id: `soloMuteData${id}`,
        data,
      });
    }, 0.25).start(0);

    return () => {
      t.cancel();
      writeLoop.current?.dispose();
    };
  }, [id, value, playbackMode]);

  return data;
}

export default useAutomationData;

function useRead({ trackId, channels }: Props) {
  const { send } = MixerMachineContext.useActorRef();

  const type = `SET_TRACK_SOLOMUTE`;
  console.log("type", type);

  const readEvent = useRef<ToneEvent | null>(null);
  const playbackMode = MixerMachineContext.useSelector(
    (state) =>
      state.context.currentTracks[trackId][
        `soloMuteMode` as keyof TrackSettings
      ]
  );

  let queryData = [];
  const paramData = useLiveQuery(async () => {
    queryData = await db[`soloMuteData` as keyof DexieDb]
      .where("id")
      .equals(`soloMuteData${trackId}`)
      .toArray();
    return queryData[0];
  });

  // !!! --- READ --- !!! //
  useEffect(() => {
    if (playbackMode !== "read") return;

    readEvent.current = new ToneEvent(() => {
      function setParam(
        trackId: number,
        data: {
          time: number;
          value: number | string | SoloMuteType;
        }
      ) {
        t.schedule(() => {
          if (playbackMode !== "read") return;
          console.log("data!", data);

          send({
            type,
            trackId,
            value: data.value,
          });
        }, data.time);
      }

      console.log("paramData", paramData);

      for (const value of paramData!.data.values()) {
        setParam(value.id, value);
      }
    }, 1).start("+0.1");

    return () => {
      readEvent.current?.dispose();
      // t.cancel();
    };
  }, [send, trackId, paramData, type, channels, playbackMode]);

  return null;
}
