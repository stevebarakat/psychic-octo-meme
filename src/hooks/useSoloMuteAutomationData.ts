import { MixerMachineContext } from "@/context/MixerMachineContext";
import { useRef, useEffect, useCallback } from "react";
import { ToneEvent, Loop, Transport as t } from "tone";
import { roundFourth } from "@/utils";
import { useLiveQuery } from "dexie-react-hooks";
import { db } from "@/db";

type Props = { trackId: number; channels: Channel[] };

type WriteProps = {
  id: number;
  value: number | string | boolean;
};

function useSoloMuteAutomationData({ trackId, channels }: Props) {
  const value: number | boolean = MixerMachineContext.useSelector((state) => {
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
    (state) => state.context.currentTracks[id].soloMuteMode
  );

  useEffect(() => {
    if (playbackMode !== "write") return;
    writeLoop.current = new Loop(() => {
      const time: number = roundFourth(t.seconds);
      data.set(time, { id, time, value });
      console.log("data", data);
      db.soloMuteData.put({
        id: `soloMuteData${id}`,
        data,
      });
    }, 0.25).start(0);

    return () => {
      writeLoop.current?.dispose();
    };
  }, [id, value, playbackMode]);

  return data;
}

function useRead({ trackId }: Props) {
  const { send } = MixerMachineContext.useActorRef();
  const playbackMode = MixerMachineContext.useSelector(
    (state) => state.context.currentTracks[trackId].soloMuteMode
  );

  const setParam = useCallback(
    (
      trackId: number,
      data: {
        time: number;
        value: number;
      }
    ) => {
      t.schedule(() => {
        if (playbackMode !== "read") return;

        send({
          type: "SET_TRACK_SOLOMUTE",
          trackId,
          value: data.value,
        });
      }, data.time);
    },
    [playbackMode, send]
  );

  const readEvent = useRef<ToneEvent | null>(null);

  let queryData = [];
  const paramData = useLiveQuery(async () => {
    queryData = await db.soloMuteData
      .where("id")
      .equals(`soloMuteData${trackId}`)
      .toArray();
    return queryData[0];
  });

  // !!! --- READ --- !!! //
  useEffect(() => {
    if (playbackMode !== "read") return;
    if (!paramData) return;

    for (const value of paramData!.data.values()) {
      setParam(value.id, value);
    }

    return () => {
      readEvent.current?.dispose();
      readEvent.current = null;
      t.cancel();
    };
  }, [paramData, setParam, playbackMode]);

  return null;
}

export default useSoloMuteAutomationData;
