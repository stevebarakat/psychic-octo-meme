import { MixerMachineContext } from "@/context/MixerMachineContext";
import TrackPanels from "./TrackPanels";
import ChannelButton from "../Buttons/ChannelButton";
import { localStorageGet, array } from "../../utils";

type Props = {
  trackId: number;
  fx: Fx;
  saveTrackFx: React.ChangeEventHandler<HTMLSelectElement>;
};

function TrackFxSelect({ trackId, fx, saveTrackFx }: Props) {
  const [, send] = MixerMachineContext.useActor();
  const currentTracks = localStorageGet("currentTracks");

  const disabled = currentTracks[trackId].fxNames.every(
    (item: string) => item === "nofx"
  );

  function handleClick() {
    send({
      type: "SET_ACTIVE_TRACK_PANELS",
      trackId,
    });
  }

  return (
    <>
      {currentTracks[trackId].panelActive !== false && (
        <TrackPanels fx={fx} trackId={trackId} />
      )}
      <ChannelButton
        className="fx-select"
        disabled={disabled}
        onClick={handleClick}
      >
        {disabled
          ? "No "
          : currentTracks[trackId].panelActive !== false
          ? "Close"
          : "Open"}
        FX
      </ChannelButton>
      {array(2).map((_, fxId) => (
        <select
          key={fxId}
          id={`track${trackId}fx${fxId}`}
          className="fx-select"
          onChange={saveTrackFx}
          value={currentTracks[trackId]?.fxNames[fxId]}
        >
          <option value={"nofx"}>{`FX ${fxId + 1}`}</option>
          <option value={"reverb"}>Reverb</option>
          <option value={"delay"}>Delay</option>
          <option value={"pitchShift"}>Pitch Shift</option>
        </select>
      ))}
    </>
  );
}

export default TrackFxSelect;
