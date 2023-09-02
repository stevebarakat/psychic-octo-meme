import { Toggle } from "@/components/Buttons";
import { MixerMachineContext } from "@/context/MixerMachineContext";

type Props = {
  trackId: number;
};

function Solo({ trackId }: Props) {
  const { send } = MixerMachineContext.useActorRef();
  const soloMute = MixerMachineContext.useSelector((state) => {
    return state.context.currentTracks[trackId].soloMute;
  });

  function toggleSolo(e: React.FormEvent<HTMLInputElement>): void {
    const checked = e.currentTarget.checked;
    send({
      type: "SET_TRACK_SOLOMUTE",
      trackId,
      value: {
        mute: soloMute.mute,
        solo: checked,
      },
    });
  }

  return (
    <Toggle
      id={`trackSolo${trackId}`}
      checked={soloMute.solo}
      onChange={toggleSolo}
    >
      S
    </Toggle>
  );
}

export default Solo;
