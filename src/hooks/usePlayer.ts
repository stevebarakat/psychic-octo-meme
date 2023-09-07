import { useRef, useEffect } from "react";
import { Player } from "tone";

type Options = ConstructorParameters<typeof Player>[0];

export default function usePlayer(options?: Options): Player {
  const player = useRef<Player | null>(null);

  useEffect(() => {
    player.current = new Player(options).toDestination();

    return () => {
      player.current?.dispose();
    };
  }, [options]);

  return player.current!;
}
