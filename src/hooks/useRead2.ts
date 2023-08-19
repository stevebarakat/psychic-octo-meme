import { MixerMachineContext } from "@/context/MixerMachineContext";
import useWrite from "@/hooks/useWrite";
import useRead from "@/hooks/useRead";

type Props = { trackId: number; channels: Channel[]; param: string };

function useRead2({ trackId, channels, param }: Props) {
  const value = MixerMachineContext.useSelector((state) => {
    return state.context.currentTracks[trackId][param];
  });

  // !!! --- WRITE --- !!! //
  useWrite({
    id: trackId,
    fxId: 0,
    param,
    value,
  });

  // !!! --- READ --- !!! //
  useRead({ trackId, channels, param });

  return null;
}

export default useRead2;
