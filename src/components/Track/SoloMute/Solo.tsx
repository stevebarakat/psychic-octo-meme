import type { Channel } from "tone";
import CheckBox from "@/components/CheckBox";
import { MixerMachineContext } from "@/context/MixerMachineContext";

type Props = {
  trackId: number;
  channels: Channel[];
};

function Solo({ trackId, channels }: Props) {
  const { send } = MixerMachineContext.useActorRef();
  const solo = MixerMachineContext.useSelector((state) => {
    return state.context.currentTracks[trackId].solo;
  });

  function toggleSolo(e: React.FormEvent<HTMLInputElement>): void {
    const checked = e.currentTarget.checked;
    send({
      type: "SET_TRACK_SOLO",
      trackId,
      checked,
      channels,
    });
  }

  return (
    <CheckBox id={`trackSolo${trackId}`} checked={solo} onChange={toggleSolo}>
      S
    </CheckBox>
  );
}

export default Solo;
