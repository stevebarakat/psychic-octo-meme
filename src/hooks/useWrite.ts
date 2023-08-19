import { useRef, useEffect } from "react";
import { MixerMachineContext } from "@/context/MixerMachineContext";
import { Loop, Transport as t } from "tone";
import { roundFourth } from "@/utils";
import { db } from "@/db";

type Props = {
  id: number;
  fxId: number;
  param: string | number;
  value: number;
};

type Data = {
  id: number;
  time: number;
  value: number;
};

const data = new Map<number, Data>();
function useWrite({ id, fxId, param, value }: Props) {
  const writeLoop = useRef<Loop | null>(null);
  const playbackMode = MixerMachineContext.useSelector(
    (state) => state.context["currentTracks"][id][`${param}Mode`]
  );

  useEffect(() => {
    if (playbackMode[fxId] !== "write") return;
    writeLoop.current = new Loop(() => {
      const time: number = roundFourth(t.seconds);
      data.set(time, { id, time, value });
      db[`${param}Data` as keyof typeof db].put({
        id: `${param}Data${id}`,
        data,
      });
    }, 0.25).start(0);

    return () => {
      t.cancel();
      writeLoop.current?.dispose();
    };
  });

  return data;
}

export default useWrite;
