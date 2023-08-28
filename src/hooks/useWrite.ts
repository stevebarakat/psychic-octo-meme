import { useEffect } from "react";
import { MixerMachineContext } from "@/context/MixerMachineContext";
import { Transport as t } from "tone";
import { roundFourth } from "@/utils";
import { db } from "@/db";

type Props = {
  id: number;
  param: string;
  value: number;
};

const data = new Map<number, object>();
function useWrite({ id, param, value }: Props) {
  const playbackMode = MixerMachineContext.useSelector(
    (state) =>
      state.context["currentTracks"][id][`${param}Mode` as keyof TrackSettings]
  );

  useEffect(() => {
    if (playbackMode !== "write") return;

    const loop = t.scheduleRepeat(
      (time) => {
        const pos: number = roundFourth(time);
        data.set(pos, { id, pos, value });
        db[`${param}Data` as keyof typeof db].put({
          id: `${param}Data${id}`,
          data,
        });
      },
      0.25,
      0
    );

    return () => {
      t.clear(loop);
    };
  }, [param, id, value, playbackMode]);

  return data;
}

export default useWrite;
