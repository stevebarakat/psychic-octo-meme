import { useEffect, useCallback } from "react";
import { MixerMachineContext } from "@/context/MixerMachineContext";
import { localStorageGet, localStorageSet } from "@/utils";
import { powerIcon } from "@/assets/icons";
import useWrite from "@/hooks/useWrite";
import PlaybackMode from "@/components/FxPlaybackMode";
import type { PitchShift } from "tone";
import { Toggle } from "@/components/Buttons";
import { Transport as t } from "tone";

type Props = {
  pitchShift: PitchShift | null;
  trackId: number;
  fxId: number;
};

type ReadProps = {
  trackId: number;
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
      pitchShift: pitchShift!,
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
      pitchShift: pitchShift!,
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
      pitchShift: pitchShift!,
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
  // !!! --- WRITE --- !!! //
  useWrite({
    id: trackId,
    fxParam: "pitchShift",
    fxId,
    value: {
      playbackMode: "static",
      pitchShiftBypass: [pitchShiftBypass],
      pitchShiftMix: [pitchShiftMix],
      pitchShiftPitch: [pitchShiftPitch],
    },
  });

  useRead({ trackId });

  // !!! --- READ --- !!! //
  function useRead({ trackId }: ReadProps) {
    const { send } = MixerMachineContext.useActorRef();
    const playbackMode = MixerMachineContext.useSelector(
      (state) =>
        state.context.currentTracks[trackId].pitchShiftSettings.playbackMode
    );

    const setParam = useCallback(
      (
        trackId: number,
        data: {
          time: number;
          value: PitchShiftSettings;
        }
      ) => {
        t.schedule(() => {
          if (playbackMode !== "read") return;

          send({
            type: "SET_TRACK_PITCHSHIFT_MIX",
            value: data.value.pitchShiftMix[fxId],
            pitchShift: pitchShift!,
            trackId,
            fxId,
          });

          send({
            type: "SET_TRACK_PITCHSHIFT_PITCH",
            value: data.value.pitchShiftPitch[fxId],
            pitchShift: pitchShift!,
            trackId,
            fxId,
          });
        }, data.time);
      },
      [send, playbackMode]
    );

    const pitchShiftData = localStorageGet("pitchShiftData");

    useEffect(() => {
      if (playbackMode !== "read" || !pitchShiftData) return;
      const objectToMap = (obj) => new Map(Object.entries(obj));
      const newDelaySettings = objectToMap(pitchShiftData);
      for (const value of newDelaySettings) {
        console.log("value[1]", value[1]);
        setParam(value[1].id, value[1]);
      }
    }, [pitchShiftData, setParam, playbackMode]);

    return null;
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
        <PlaybackMode trackId={trackId} fxId={fxId} param="pitchShift" />
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
