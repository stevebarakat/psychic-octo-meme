import { MixerMachineContext } from "@/context/MixerMachineContext";
import useAutomationData from "@/hooks/useAutomationData";
import { localStorageSet, localStorageGet } from "@/utils";
import PlaybackMode from "../PlaybackMode";

type Props = {
  trackId: number;
  channels: Channel[];
};

function Pan({ trackId, channels }: Props) {
  const { send } = MixerMachineContext.useActorRef();
  const pan = MixerMachineContext.useSelector((state) => {
    return state.context.currentTracks[trackId].pan;
  });

  useAutomationData({ trackId, channels, param: "pan" });

  function setPan(e: React.FormEvent<HTMLInputElement>): void {
    send({
      type: "SET_TRACK_PAN",
      value: parseFloat(e.currentTarget.value),
      trackId,
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
      <PlaybackMode trackId={trackId} param="pan" />
    </>
  );
}

export default Pan;
