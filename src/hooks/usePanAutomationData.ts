import { MixerMachineContext } from "@/context/MixerMachineContext";
import { useEffect, useCallback } from "react";
import { Transport as t } from "tone";
import { localStorageGet, localStorageSet, roundFourth } from "@/utils";

type Props = { trackId: number; channels: Channel[] };

type WriteProps = {
  id: number;
  value: number | string | boolean;
};

function usePanAutomationData({ trackId, channels }: Props) {
  const value: number | boolean = MixerMachineContext.useSelector(
    (state) => state.context.currentTracks[trackId].pan
  );
  useWrite({ id: trackId, value });
  useRead({ trackId, channels });
  return null;
}

const data = new Map<number, object>();

// !!! --- WRITE --- !!! //
function useWrite({ id, value }: WriteProps) {
  const playbackMode = MixerMachineContext.useSelector(
    (state) => state.context.currentTracks[id].panMode
  );

  useEffect(() => {
    if (playbackMode !== "write") return;

    const loop = t.scheduleRepeat(
      () => {
        const time: number = roundFourth(t.seconds);
        data.set(time, { id, time, value });
        const mapToObject = (map) => Object.fromEntries(map.entries());
        const newData = mapToObject(data);
        localStorageSet("panData", newData);
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
    (state) => state.context.currentTracks[trackId].panMode
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
          type: "SET_TRACK_PAN",
          trackId,
          value: data.value,
        });
      }, data.time);
    },
    [playbackMode, send]
  );

  const panData = localStorageGet("panData");

  useEffect(() => {
    if (playbackMode !== "read") return;
    const objectToMap = (obj) => new Map(Object.entries(obj));
    const newPanData = objectToMap(panData);
    for (const value of newPanData) {
      setParam(value[1].id, value[1]);
    }
  }, [panData, setParam, playbackMode]);

  return null;
}
export default usePanAutomationData;
