import { useEffect } from "react";
import { MixerMachineContext } from "@/context/MixerMachineContext";
import { Transport as t } from "tone";
import { roundFourth } from "@/utils";
import { db } from "@/db";

type Props = {
  id: number;
  fxParam: "reverb" | "delay" | "pitchShift";
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
        db[`${fxParam}Data`].put({
          id: `${fxParam}Data${id}`,
          data,
        });
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
