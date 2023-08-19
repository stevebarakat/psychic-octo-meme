import type { Channel } from "tone";
import CheckBox from "@/components/CheckBox";
import { MixerMachineContext } from "@/context/MixerMachineContext";

type Props = {
  trackId: number;
  channel: Channel;
};

function Mute({ trackId, channel }: Props) {
  const { send } = MixerMachineContext.useActorRef();
  const mute = MixerMachineContext.useSelector((state) => {
    return state.context.currentTracks[trackId].mute;
  });

  function toggleMute(e: React.FormEvent<HTMLInputElement>): void {
    const checked = e.currentTarget.checked;
    send({
      type: "SET_TRACK_MUTE",
      checked,
      trackId,
      channel,
    });
  }

  return (
    <CheckBox id={`trackMute${trackId}`} checked={mute} onChange={toggleMute}>
      M
    </CheckBox>
  );
}

export default Mute;
