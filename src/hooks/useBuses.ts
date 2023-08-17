import { useEffect, useRef } from "react";
import { Volume } from "tone";

function useBuses() {
  const busChannels = useRef<BusChannel[]>([null, null]);

  useEffect(() => {
    busChannels.current.forEach((_: BusChannel, busId: number) => {
      busChannels.current[busId]?.disconnect();
      busChannels.current[busId] = new Volume().toDestination();
    });

    return () => {
      busChannels.current.forEach((busChannel) => busChannel?.dispose());
      busChannels.current = [null, null];
    };
  }, []);

  return [busChannels];
}

export default useBuses;
