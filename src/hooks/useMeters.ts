import { useEffect, useCallback, useRef, useState } from "react";
import { Meter } from "tone";

export default function useMeters(
  channels: (Destination | Channel)[],
  meters: React.MutableRefObject<Meter[]>
) {
  const [meterLevels, setMeterLevels] = useState<Float32Array>(
    () => new Float32Array(channels.length)
  );
  const animation = useRef<number | null>(null);

  // loop recursively to amimateMeters
  const animateMeter = useCallback(() => {
    meters.current.forEach((meter) => {
      const values = meter.getValue();
      if (typeof values !== "object") return;
      values.forEach((value, i) => (meterLevels[i] = value));
      setMeterLevels(new Float32Array(meterLevels));
    });
    animation.current = requestAnimationFrame(animateMeter);
  }, [meterLevels, meters]);

  // trigger animateMeter
  useEffect(() => {
    animateMeter();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return meterLevels;
}
