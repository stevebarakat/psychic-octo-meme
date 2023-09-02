import { useEffect } from "react";
import { MixerMachineContext } from "@/context/MixerMachineContext";
import { Transport as t } from "tone";
import { roundFourth } from "@/utils";
import { db } from "@/db";

type Props = {
  id: number;
  // trackParam?: "volume" | "pan" | "soloMute";
  fxParam?: "reverb" | "delay" | "pitchShift";
  fxId: number;
  reverbSettings: ReverbSettings;
};

const data = new Map<number, object>();
function useWrite({ id, fxParam, reverbSettings }: Props) {
  const { playbackMode } = MixerMachineContext.useSelector(
    (state) =>
      state.context.currentTracks[id][
        `${fxParam}Settings` as keyof TrackSettings
      ]
  );

  useEffect(() => {
    console.log("playbackMode", playbackMode);
    if (playbackMode !== "write") return;

    const loop = t.scheduleRepeat(
      () => {
        const time: number = roundFourth(t.seconds);
        data.set(time, { id, time, reverbSettings });
        db[`${fxParam}Data` as keyof typeof db].put({
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
  }, [fxParam, id, reverbSettings, playbackMode]);

  return data;
}

export default useWrite;
