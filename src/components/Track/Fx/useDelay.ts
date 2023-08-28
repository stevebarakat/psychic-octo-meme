import { useRef, useEffect } from "react";
import { FeedbackDelay } from "tone";

type Options = ConstructorParameters<typeof FeedbackDelay>[0];

export default function useDelay(options?: Options): FeedbackDelay {
  const delay = useRef<FeedbackDelay | null>(null);

  useEffect(() => {
    delay.current = new FeedbackDelay(options).toDestination();

    return () => {
      delay.current?.dispose();
    };
  }, [options]);

  return delay.current!;
}
