import { MixerMachineContext } from "@/context/MixerMachineContext";
import { useRef, useEffect } from "react";
import { ToneEvent, Loop, Transport as t } from "tone";
import { roundFourth } from "@/utils";
import { useLiveQuery } from "dexie-react-hooks";
import { DexieDb, db } from "@/db";

type Props = { trackId: number; channels: Channel[] };

type WriteProps = {
  id: number;
  value: number | string | boolean;
};

function useAutomationData({ trackId, channels }: Props) {
  const value: number | boolean = MixerMachineContext.useSelector((state) => {
    return state.context.currentTracks[trackId].volume;
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
      state.context["currentTracks"][id][`volumeMode` as keyof TrackSettings]
  );

  useEffect(() => {
    console.log("playbackMode!", playbackMode);
    if (playbackMode !== "write") return;
    writeLoop.current = new Loop(() => {
      const time: number = roundFourth(t.seconds);
      data.set(time, { id, time, value });
      console.log("data", data);
      db[`volumeData` as keyof typeof db].put({
        id: `volumeData${id}`,
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

  const type = `SET_TRACK_VOLUME`;
  console.log("type", type);

  const readEvent = useRef<ToneEvent | null>(null);
  const playbackMode = MixerMachineContext.useSelector(
    (state) =>
      state.context.currentTracks[trackId][`volumeMode` as keyof TrackSettings]
  );

  let queryData = [];
  const paramData = useLiveQuery(async () => {
    queryData = await db[`volumeData` as keyof DexieDb]
      .where("id")
      .equals(`volumeData${trackId}`)
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
          value: number;
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
