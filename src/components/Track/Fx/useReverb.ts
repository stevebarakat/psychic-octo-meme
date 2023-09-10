import { useRef, useEffect } from "react";
import { Reverb } from "tone";

type Options = ConstructorParameters<typeof Reverb>[0];

export default function useReverb(options?: Options): Reverb {
  const reverb = useRef<Reverb | null>(null);

  useEffect(() => {
    // reverb.current = new Reverb(options).toDestination();
    reverb.current = new Reverb(options);

    return () => {
      reverb.current?.dispose();
    };
  }, [options]);

  return reverb.current!;
}
