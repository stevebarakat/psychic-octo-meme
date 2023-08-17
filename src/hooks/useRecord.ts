import { useRef, useEffect } from "react";
import { MixerMachineContext } from "@/context/MixerMachineContext";
import { Loop, Transport as t } from "tone";
import upperFirst from "lodash/upperFirst";
import { db } from "@/db";

function roundHalf(num) {
  return (Math.round(num * 4) / 4).toFixed(2);
}

type Props = {
  id: number;
  fxId: number;
  channelType: string;
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
function useRecord({
  id,
  fxId,
  channelType,
  param,
  param1,
  param2,
  param3,
  param4,
}: Props) {
  const writeLoop = useRef<Loop | null>(null);
  const playbackMode = MixerMachineContext.useSelector(
    (state) => state.context[channelType][id][`${param}Mode`]
  );

  useEffect(() => {
    if (playbackMode[fxId] !== "write") return;
    writeLoop.current = new Loop(() => {
      const time: number = roundHalf(t.seconds);
      data.set(time, { id, time, param1, param2, param3, param4 });
      if (channelType === "currentTracks") {
        db[`${param}Data` as keyof typeof db].put({
          id: `${param}Data${id}`,
          data,
        });
      } else if (channelType === "currentBuses") {
        db[`bus${upperFirst(param.toString())}Data` as keyof typeof db].put({
          id: `${param}Data${id}`,
          data,
        });
      }
    }, 0.075).start(0);

    return () => {
      t.off;
      writeLoop.current?.dispose();
    };
  });

  return data;
}

export default useRecord;
