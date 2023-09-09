import { useEffect, useCallback, useRef, useState } from "react";
import { Destination, Meter } from "tone";

export default function useMeter() {
  const meters = useRef<Meter[]>([]);
  const [meterLevels, setMeterLevels] = useState<Float32Array>(
    () => new Float32Array(1)
  );
  const animation = useRef<number | null>(null);

  // loop recursively to amimateMeters
  const animateMeter = useCallback(() => {
    meters.current.forEach((meter, i) => {
      const value = meter.getValue();
      if (typeof value === "number") {
        meterLevels[i] = value;
        setMeterLevels(new Float32Array(meterLevels));
      }
    });
    animation.current = requestAnimationFrame(animateMeter);
  }, [meterLevels, meters]);

  // create meter and trigger animateMeter
  useEffect(() => {
    [Destination].map((channel, i) => {
      meters.current[i] = new Meter();
      return channel?.connect(meters.current[i]);
    });
    animateMeter();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return meterLevels;
}
