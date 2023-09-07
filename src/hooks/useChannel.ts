import { useRef, useEffect } from "react";
import { Channel } from "tone";

type Options = ConstructorParameters<typeof Channel>[0];

export default function useChannel(options?: Options): Channel {
  const channel = useRef<Channel | null>(null);

  useEffect(() => {
    channel.current = new Channel(options).toDestination();

    return () => {
      channel.current?.dispose();
    };
  }, [options]);

  return channel.current!;
}
