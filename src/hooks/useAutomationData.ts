import { MixerMachineContext } from "@/context/MixerMachineContext";
import useWrite from "@/hooks/useWrite";
import useRead from "@/hooks/useRead";

type Props = { trackId: number; channels: Channel[]; param: string };

function useAutomationData({ trackId, channels, param }: Props) {
  const value: number | boolean = MixerMachineContext.useSelector((state) => {
    return state.context.currentTracks[trackId]["solo"];
  });

  const value2: number | boolean = MixerMachineContext.useSelector((state) => {
    return state.context.currentTracks[trackId]["mute"];
  });

  // !!! --- WRITE --- !!! //
  useWrite({
    id: trackId,
    param,
    value,
    value2,
  });

  // !!! --- READ --- !!! //
  useRead({ trackId, channels, param });

  return null;
}

export default useAutomationData;
