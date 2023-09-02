import { Toggle } from "@/components/Buttons";
import { MixerMachineContext } from "@/context/MixerMachineContext";

type Props = {
  trackId: number;
};

function Mute({ trackId }: Props) {
  const { send } = MixerMachineContext.useActorRef();
  const soloMute = MixerMachineContext.useSelector((state) => {
    return state.context.currentTracks[trackId].soloMute;
  });

  function toggleMute(e: React.FormEvent<HTMLInputElement>): void {
    const checked = e.currentTarget.checked;
    send({
      type: "SET_TRACK_SOLOMUTE",
      trackId,
      value: {
        solo: soloMute.solo,
        mute: checked,
      },
    });
  }

  return (
    <Toggle
      id={`trackMute${trackId}`}
      checked={soloMute.mute}
      onChange={toggleMute}
    >
      M
    </Toggle>
  );
}

export default Mute;
