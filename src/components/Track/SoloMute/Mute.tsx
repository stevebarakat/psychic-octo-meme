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
    return state.context.currentTracks[trackId].soloMute;
  });

  function toggleMute(e: React.FormEvent<HTMLInputElement>): void {
    const checked = e.currentTarget.checked;
    send({
      type: "SET_TRACK_SOLOMUTE",
      trackId,
      channels,
      value: mute[0],
      value2: checked,
    });
  }

  return (
    <Toggle id={`trackMute${trackId}`} checked={mute[1]} onChange={toggleMute}>
      M
    </Toggle>
  );
}

export default Mute;
