import { useRef, useEffect } from "react";
import { MixerMachineContext } from "@/context/MixerMachineContext";
import { Loop, Transport as t } from "tone";
import { roundFourth } from "@/utils";
import { db } from "@/db";

type Props = {
  id: number;
  fxId: number;
  param: string | number;
  param1: number;
  param2?: number;
  param3?: number | boolean;
  param4?: number | boolean;
};

type Data = {
  id: number;
  time: number;
  param1: number;
  param2?: number;
  param3?: number | boolean;
  param4?: number | boolean;
};

const data = new Map<number, Data>();
function useRecord({ id, fxId, param, param1, param2, param3, param4 }: Props) {
  const writeLoop = useRef<Loop | null>(null);
  const playbackMode = MixerMachineContext.useSelector(
    (state) => state.context["currentTracks"][id][`${param}Mode`]
  );

  useEffect(() => {
    if (playbackMode[fxId] !== "write") return;
    writeLoop.current = new Loop(() => {
      const time: number = roundFourth(t.seconds);
      data.set(time, { id, time, param1, param2, param3, param4 });
      db[`${param}Data` as keyof typeof db].put({
        id: `${param}Data${id}`,
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

export default useRecord;
