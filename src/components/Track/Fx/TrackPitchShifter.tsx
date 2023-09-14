import { useEffect, useCallback } from "react";
import { MixerMachineContext } from "@/context/MixerMachineContext";
import { powerIcon } from "@/assets/icons";
import useWrite from "@/hooks/useWrite";
import PlaybackMode from "@/components/FxPlaybackMode";
import type { PitchShift } from "tone";
import { Toggle } from "@/components/Buttons";
import { Transport as t } from "tone";
import { useLiveQuery } from "dexie-react-hooks";
import { db } from "@/db";

type Props = {
  pitchShift: PitchShift | null;
  trackId: number;
};

type ReadProps = {
  trackId: number;
};

export default function PitchShifter({ pitchShift, trackId }: Props) {
  const { send } = MixerMachineContext.useActorRef();

  const pitchShiftBypass = MixerMachineContext.useSelector((state) => {
    return state.context.currentTracks[trackId].pitchShiftSettings
      .pitchShiftBypass;
  });

  const pitchShiftMix = MixerMachineContext.useSelector((state) => {
    return state.context.currentTracks[trackId].pitchShiftSettings
      .pitchShiftMix;
  });

  const pitchShiftPitch = MixerMachineContext.useSelector((state) => {
    return state.context.currentTracks[trackId].pitchShiftSettings
      .pitchShiftPitch;
  });

  function toggleBypass(e: React.FormEvent<HTMLInputElement>): void {
    const checked = e.currentTarget.checked;
    send({
      type: "SET_TRACK_PITCHSHIFT_BYPASS",
      checked,
      pitchShift: pitchShift!,
      trackId,
    });
  }

  function setMix(e: React.FormEvent<HTMLInputElement>): void {
    const value = parseFloat(e.currentTarget.value);
    send({
      type: "SET_TRACK_PITCHSHIFT_MIX",
      value,
      pitchShift: pitchShift!,
      trackId,
    });
  }
  function setPitch(e: React.FormEvent<HTMLInputElement>): void {
    const value = parseFloat(e.currentTarget.value);
    send({
      type: "SET_TRACK_PITCHSHIFT_PITCH",
      value,
      pitchShift: pitchShift!,
      trackId,
    });
  }

  // !!! --- WRITE --- !!! //
  useWrite({
    id: trackId,
    fxParam: "pitchShift",
    value: {
      playbackMode: "static",
      pitchShiftBypass: pitchShiftBypass,
      pitchShiftMix: pitchShiftMix,
      pitchShiftPitch: pitchShiftPitch,
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
            value: data.value.pitchShiftMix,
            pitchShift: pitchShift!,
            trackId,
          });

          send({
            type: "SET_TRACK_PITCHSHIFT_PITCH",
            value: data.value.pitchShiftPitch,
            pitchShift: pitchShift!,
            trackId,
          });
        }, data.time);
      },
      [send, playbackMode]
    );

    let queryData = [];
    const pitchShiftData = useLiveQuery(async () => {
      queryData = await db.pitchShiftData
        .where("id")
        .equals(`pitchShiftData${trackId}`)
        .toArray();
      return queryData[0];
    });

    useEffect(() => {
      if (playbackMode !== "read" || !pitchShiftData) return;
      for (const value of pitchShiftData.data.values()) {
        setParam(value.id, value);
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
        />
      </div>
    </div>
  );
}
