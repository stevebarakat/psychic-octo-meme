import { useEffect } from "react";
import { MixerMachineContext } from "@/context/MixerMachineContext";
import { Transport as t } from "tone";
import { localStorageSet, roundFourth } from "@/utils";

type Props = {
  id: number;
  fxParam: "reverb" | "delay" | "pitchShift";
  fxId: number;
  value: ReverbSettings | DelaySettings | PitchShiftSettings;
};

const data = new Map<number, object>();
function useWrite({ id, fxParam, value }: Props) {
  const { playbackMode } = MixerMachineContext.useSelector(
    (state) => state.context.currentTracks[id][`${fxParam}Settings`]
  );

  useEffect(() => {
    if (playbackMode !== "write") return;

    const loop = t.scheduleRepeat(
      () => {
        const time: number = roundFourth(t.seconds);
        data.set(time, { id, time, value });

        const mapToObject = (map) => Object.fromEntries(map.entries());
        const newData = mapToObject(data);
        localStorageSet(`${fxParam}Data`, newData);
      },
      0.25,
      0
    );

    return () => {
      t.clear(loop);
    };
  }, [fxParam, id, value, playbackMode]);

  return data;
}

export default useWrite;
