import type { Channel } from "tone";
import { Toggle } from "@/components/Buttons";
import { MixerMachineContext } from "@/context/MixerMachineContext";

type Props = {
  trackId: number;
  channels: Channel[];
};

function Mute({ trackId, channels }: Props) {
  const { send } = MixerMachineContext.useActorRef();
  const mute = MixerMachineContext.useSelector((state) => {
    return state.context.currentTracks[trackId].soloMute[1];
  });

  function toggleMute(e: React.FormEvent<HTMLInputElement>): void {
    const checked = e.currentTarget.checked;
    send({
      type: "SET_TRACK_SOLOMUTE",
      trackId,
      channels,
      value2: checked,
    });
  }

  return (
    <Toggle id={`trackMute${trackId}`} checked={mute} onChange={toggleMute}>
      M
    </Toggle>
  );
}

export default Mute;
