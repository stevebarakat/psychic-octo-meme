import { MixerMachineContext } from "@/context/MixerMachineContext";
import useWrite from "@/hooks/useWrite";
import useRead from "@/hooks/useRead";

type Props = {
  trackId: number;
  channels: Channel[];
  param: "volume" | "pan" | "soloMute";
};

function useAutomationData({ trackId, channels, param }: Props) {
  const value: number | boolean = MixerMachineContext.useSelector((state) => {
    return state.context.currentTracks[trackId][param];
  });

  // !!! --- WRITE --- !!! //
  useWrite({
    id: trackId,
    param,
    value,
  });

  // !!! --- READ --- !!! //
  useRead({ trackId, channels, param });

  return null;
}

export default useAutomationData;
