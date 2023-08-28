import { useRef } from "react";
import { PitchShift } from "tone";

export type Options = ConstructorParameters<typeof PitchShift>[0];

export default function usePitchShift(options?: Options): PitchShift {
  const pitchShift = useRef<PitchShift>(new PitchShift(options));

  return pitchShift.current!;
}
