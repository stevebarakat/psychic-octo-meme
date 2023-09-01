import { useRef, useEffect } from "react";
import { Gain } from "tone";

type Options = ConstructorParameters<typeof Gain>[0];

export default function useNoFx(options?: Options): Gain {
  const nofx = useRef<Gain | null>(null);

  useEffect(() => {
    nofx.current = new Gain(options).toDestination();

    return () => {
      nofx.current?.dispose();
    };
  }, [options]);

  return nofx.current!;
}
