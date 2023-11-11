import { MixerMachineContext } from "@/context/MixerMachineContext";
import { useEffect, useCallback } from "react";
import { Transport as t } from "tone";
import { localStorageGet, localStorageSet, roundFourth } from "@/utils";
import { useLiveQuery } from "dexie-react-hooks";
import { db } from "@/db";

type Props = { trackId: number; channels: Channel[] };

type WriteProps = {
  id: number;
  value: { solo: boolean; mute: boolean };
};

function useSoloMuteAutomationData({ trackId, channels }: Props) {
  const value: { solo: boolean; mute: boolean } =
    MixerMachineContext.useSelector(
      (state) => state.context.currentTracks[trackId].soloMute
    );
  useWrite({ id: trackId, value });
  useRead({ trackId, channels });
  return null;
}

const data = new Map<
  number,
  { id: number; value: { solo: boolean; mute: boolean }; time: number }
>();

// !!! --- WRITE --- !!! //

function useWrite({ id, value }: WriteProps) {
  const playbackMode = MixerMachineContext.useSelector(
    (state) => state.context.currentTracks[id].soloMuteMode
  );

  useEffect(() => {
    if (playbackMode !== "write") return;

    const loop = t.scheduleRepeat(
      () => {
        const time: number = roundFourth(t.seconds);
        data.set(time, { id, time, value });
        const mapToObject = (map: typeof data) =>
          Object.fromEntries(map.entries());
        const newData = mapToObject(data);
        localStorageSet("soloMuteData", newData);
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

  const soloMuteData = localStorageGet("soloMuteData");

  useEffect(() => {
    if (playbackMode !== "read") return;
    const objectToMap = (obj) => new Map(Object.entries(obj));
    const newSoloMuteData = objectToMap(soloMuteData);
    for (const value of newSoloMuteData) {
      console.log("value", value[1]);
      setParam(value[1].id, value[1]);
    }
  }, [soloMuteData, setParam, playbackMode]);

  return null;
}
export default useSoloMuteAutomationData;
