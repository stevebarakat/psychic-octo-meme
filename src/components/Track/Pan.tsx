import { MixerMachineContext } from "@/context/MixerMachineContext";
import { localStorageSet, localStorageGet } from "@/utils";

type Props = {
  trackId: number;
  channel: Channel;
};

function Pan({ trackId, channel }: Props) {
  const { send } = MixerMachineContext.useActorRef();
  const pan = MixerMachineContext.useSelector((state) => {
    return state.context.currentTracks[trackId].pan;
  });

  function setPan(e: React.FormEvent<HTMLInputElement>): void {
    send({
      type: "SET_PAN",
      value: parseFloat(e.currentTarget.value),
      trackId,
      channel,
    });
  }

  function savePan(e: React.FormEvent<HTMLInputElement>): void {
    const value = parseFloat(e.currentTarget.value);
    const currentTracks = localStorageGet("currentTracks");
    currentTracks[trackId].pan = value;
    localStorageSet("currentTracks", currentTracks);
  }

  return (
    <>
      <input
        type="range"
        id={`trackPan${trackId}`}
        className="range-x"
        min={-1}
        max={1}
        step={0.01}
        value={pan}
        onChange={setPan}
        onPointerUp={savePan}
      />
    </>
  );
}

export default Pan;
