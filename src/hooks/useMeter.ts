import { useEffect, useCallback, useRef, useState } from "react";
import { Meter } from "tone";

export default function useMeter(
  channels: (Destination | Channel | BusChannel)[]
) {
  const [meterVals, setMeterVals] = useState<Float32Array>(
    () => new Float32Array(channels.length)
  );
  const meters = useRef<Meter[]>([]);
  const animation = useRef<number | null>(null);

  // loop recursively to amimateMeters
  const animateMeter = useCallback(() => {
    meters.current.forEach((meter, i) => {
      const val = meter.getValue();
      if (typeof val === "number") {
        meterVals[i] = val;
        setMeterVals(new Float32Array(meterVals));
      }
    });
    animation.current = requestAnimationFrame(animateMeter);
  }, [meterVals]);

  // create meter and trigger animateMeter
  useEffect(() => {
    channels.map((channel, i) => {
      meters.current[i] = new Meter();
      return channel?.connect(meters.current[i]);
    });
    requestAnimationFrame(animateMeter);
    return () => {
      animation.current && cancelAnimationFrame(animation.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return meterVals;
}
