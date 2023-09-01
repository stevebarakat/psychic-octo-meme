import { useRef, useEffect } from "react";
import { Volume } from "tone";

type Options = ConstructorParameters<typeof Volume>[0];

export default function useNoFx(options?: Options): Volume {
  const nofx = useRef<Volume | null>(null);

  useEffect(() => {
    nofx.current = new Volume(options).toDestination();

    return () => {
      nofx.current?.dispose();
    };
  }, [options]);

  return nofx.current!;
}
