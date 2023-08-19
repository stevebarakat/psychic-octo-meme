import { useRef, useEffect } from "react";
import { MixerMachineContext } from "@/context/MixerMachineContext";
import { Loop, Transport as t } from "tone";
import { roundFourth } from "@/utils";
import { db } from "@/db";

type Props = {
  id: number;
  fxId: number;
  param1: number;
};

type Data = {
  id: number;
  time: number;
  param1: number;
};

const data = new Map<number, Data>();
function useWrite({ id, fxId, param1 }: Props) {
  const writeLoop = useRef<Loop | null>(null);
  const playbackMode = MixerMachineContext.useSelector(
    (state) => state.context["currentTracks"][id][`volumeMode`]
  );

  useEffect(() => {
    if (playbackMode[fxId] !== "write") return;
    writeLoop.current = new Loop(() => {
      const time: number = roundFourth(t.seconds);
      data.set(time, { id, time, param1 });
      db[`volumeData` as keyof typeof db].put({
        id: `volumeData${id}`,
        data,
      });
    }, 0.25).start(0);

    return () => {
      t.off;
      writeLoop.current?.dispose();
    };
  });

  return data;
}

export default useWrite;
