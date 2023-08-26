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
    return state.context.currentTracks[trackId].soloMute;
  });

  function toggleSolo(e: React.FormEvent<HTMLInputElement>): void {
    const checked = e.currentTarget.checked;
    send({
      type: "SET_TRACK_SOLOMUTE",
      trackId,
      value: checked,
      value2: solo[1],
    });
  }

  return (
    <Toggle id={`trackSolo${trackId}`} checked={solo[0]} onChange={toggleSolo}>
      S
    </Toggle>
  );
}

export default Solo;
