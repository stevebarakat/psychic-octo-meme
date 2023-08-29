import { useRef, useEffect } from "react";
import { PitchShift } from "tone";

type Options = ConstructorParameters<typeof PitchShift>[0];

export default function usePitchShift(options?: Options): PitchShift {
  const pitchShift = useRef<PitchShift | null>(null);

  useEffect(() => {
    pitchShift.current = new PitchShift(options).toDestination();

    return () => {
      pitchShift.current?.dispose();
    };
  }, [options]);

  return pitchShift.current!;
}
