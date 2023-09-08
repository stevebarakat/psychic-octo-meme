import { MixerMachineContext } from "@/context/MixerMachineContext";
import { useEffect, useCallback } from "react";
import { Transport as t } from "tone";
import { roundFourth } from "@/utils";
import { useLiveQuery } from "dexie-react-hooks";
import { db } from "@/db";

type Props = { trackId: number; channels: Channel[] };

type WriteProps = {
  id: number;
  value: number | string | boolean;
};

function useTrackAutomationData({ trackId, channels }: Props) {
  const value: number | boolean = MixerMachineContext.useSelector((state) => {
    return state.context.currentTracks[trackId].volume;
  });
  useWrite({ id: trackId, value });
  useRead({ trackId, channels });
  return null;
}

const data = new Map<number, object>();

// !!! --- WRITE --- !!! //
function useWrite({ id, value }: WriteProps) {
  const playbackMode = MixerMachineContext.useSelector(
    (state) => state.context.currentTracks[id].volumeMode
  );

  useEffect(() => {
    if (playbackMode !== "write") return;

    const loop = t.scheduleRepeat(
      () => {
        const time: number = roundFourth(t.seconds);
        data.set(time, { id, time, value });
        db.volumeData.put({
          id: `volumeData${id}`,
          data,
        });
      },
      0.25,
      0
    );

    return () => {
      t.clear(loop);
    };
  }, [id, value, playbackMode]);

  return data;
}

// !!! --- READ --- !!! //
function useRead({ trackId }: Props) {
  const { send } = MixerMachineContext.useActorRef();
  const playbackMode = MixerMachineContext.useSelector(
    (state) => state.context.currentTracks[trackId].volumeMode
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
          type: "SET_TRACK_VOLUME",
          trackId,
          value: data.value,
        });
      }, data.time);
    },
    [playbackMode, send]
  );

  let queryData = [];
  const volumeData = useLiveQuery(async () => {
    queryData = await db.volumeData
      .where("id")
      .equals(`volumeData${trackId}`)
      .toArray();
    return queryData[0];
  });

  useEffect(() => {
    if (playbackMode !== "read" || !volumeData) return;

    for (const value of volumeData.data.values()) {
      setParam(value.id, value);
    }
  }, [volumeData, setParam, playbackMode]);

  return null;
}
export default useTrackAutomationData;
