import { MixerMachineContext } from "@/context/MixerMachineContext";
import { localStorageGet, localStorageSet } from "@/utils";
import { powerIcon } from "@/assets/icons";
import PlaybackMode from "@/components/FxPlaybackMode";
import { Toggle } from "@/components/Buttons";
import type { PitchShift } from "tone";

type Props = {
  pitchShift: PitchShift | null;
  trackId: number;
  fxId: number;
};

export default function PitchShifter({ pitchShift, trackId, fxId }: Props) {
  const { send } = MixerMachineContext.useActorRef();

  const pitchShiftBypass = MixerMachineContext.useSelector((state) => {
    return state.context.currentTracks[trackId].pitchShiftSettings
      .pitchShiftBypass[fxId];
  });

  const pitchShiftMix = MixerMachineContext.useSelector((state) => {
    return state.context.currentTracks[trackId].pitchShiftSettings
      .pitchShiftMix[fxId];
  });

  const pitchShiftPitch = MixerMachineContext.useSelector((state) => {
    return state.context.currentTracks[trackId].pitchShiftSettings
      .pitchShiftPitch[fxId];
  });

  function toggleBypass(e: React.FormEvent<HTMLInputElement>): void {
    const checked = e.currentTarget.checked;
    send({
      type: "SET_TRACK_PITCHSHIFT_BYPASS",
      checked,
      pitchShift,
      trackId,
      fxId,
    });
    const currentTracks = localStorageGet("currentTracks");
    currentTracks[trackId].pitchShiftSettings.pitchShiftBypass[fxId] = checked;
    localStorageSet("currentTracks", currentTracks);
  }

  function setMix(e: React.FormEvent<HTMLInputElement>): void {
    const value = parseFloat(e.currentTarget.value);
    send({
      type: "SET_TRACK_PITCHSHIFT_MIX",
      value,
      pitchShift,
      trackId,
      fxId,
    });
  }
  function saveMix(e: React.FormEvent<HTMLInputElement>): void {
    const value = parseFloat(e.currentTarget.value);
    const currentTracks = localStorageGet("currentTracks");
    currentTracks[trackId].pitchShiftSettings.pitchShiftMix[fxId] = value;
    localStorageSet("currentTracks", currentTracks);
  }

  function setPitch(e: React.FormEvent<HTMLInputElement>): void {
    const value = parseFloat(e.currentTarget.value);
    send({
      type: "SET_TRACK_PITCHSHIFT_PITCH",
      value,
      pitchShift,
      trackId,
      fxId,
    });
  }

  function savePitch(e: React.FormEvent<HTMLInputElement>): void {
    const value = parseFloat(e.currentTarget.value);
    const currentTracks = localStorageGet("currentTracks");
    currentTracks[trackId].pitchShiftSettings.pitchShiftPitch[fxId] = value;
    localStorageSet("currentTracks", currentTracks);
  }

  return (
    <div>
      <div className="flex gap12">
        <h3>Pitch Shift</h3>
        <div className="power-button">
          <Toggle
            id={`track${trackId}pitchShiftBypass`}
            onChange={toggleBypass}
            checked={pitchShiftBypass}
          >
            {powerIcon}
          </Toggle>
        </div>
      </div>
      <div className="flex-y">
        <PlaybackMode trackId={trackId} param="pitchShift" />
        <label htmlFor={`track${trackId}pitchShiftMix`}>Mix:</label>
        <input
          type="range"
          id={`track${trackId}pitchShiftMix`}
          min={0}
          max={1}
          step={0.01}
          disabled={pitchShiftBypass}
          value={pitchShiftMix}
          onChange={setMix}
          onPointerUp={saveMix}
        />
      </div>
      <div className="flex-y">
        <label htmlFor={`track${trackId}pitchShiftPitch`}>Pitch:</label>
        <input
          type="range"
          id={`track${trackId}pitchShiftPitch`}
          min={-24}
          max={24}
          step={1}
          disabled={pitchShiftBypass}
          value={pitchShiftPitch}
          onChange={setPitch}
          onPointerUp={savePitch}
        />
      </div>
    </div>
  );
}
