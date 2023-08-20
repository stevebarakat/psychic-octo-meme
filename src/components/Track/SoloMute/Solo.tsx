import type { Channel } from "tone";
import { Toggle } from "@/components/Buttons";
import { MixerMachineContext } from "@/context/MixerMachineContext";

type Props = {
  trackId: number;
  channels: Channel[];
};

function Solo({ trackId, channels }: Props) {
  const { send } = MixerMachineContext.useActorRef();
  const solo = MixerMachineContext.useSelector((state) => {
    return state.context.currentTracks[trackId].soloMute[0];
  });

  function toggleSolo(e: React.FormEvent<HTMLInputElement>): void {
    const checked = e.currentTarget.checked;
    send({
      type: "SET_TRACK_SOLOMUTE",
      trackId,
      channels,
      value: checked,
    });
  }

  return (
    <Toggle id={`trackSolo${trackId}`} checked={solo} onChange={toggleSolo}>
      S
    </Toggle>
  );
}

export default Solo;
