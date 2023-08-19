import { useRef, useEffect } from "react";
import { MixerMachineContext } from "@/context/MixerMachineContext";
import { localStorageGet, localStorageSet } from "@/utils";
import { powerIcon } from "@/assets/icons";
import PlaybackMode from "@/components/PlaybackMode";
import useWrite from "@/hooks/useWrite";
import CheckBox from "@/components/CheckBox";
import { Loop, Draw, Transport as t } from "tone";
import { useLiveQuery } from "dexie-react-hooks";
import { db } from "@/db";
import type { PitchShift } from "tone";

type Props = {
  pitchShift: PitchShift | null;
  trackId: number;
  fxId: number;
};

export default function PitchShifter({ pitchShift, trackId, fxId }: Props) {
  const { send } = MixerMachineContext.useActorRef();

  const playbackLoop = useRef<Loop | null>(null);
  const playbackMode = MixerMachineContext.useSelector(
    (state) => state.context.currentTracks[trackId]["pitchShiftMode"][fxId]
  );

  useEffect(() => {
    send({
      type: "SET_GLOBAL_PLAYBACK_MODE",
      playbackMode,
    });
  }, [send, playbackMode]);

  let queryData = [];
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const trackData =
    useLiveQuery(async () => {
      queryData = await db["pitchShiftData"]
        .where("id")
        .equals(`pitchShiftData${trackId}`)
        .toArray();
      return queryData[0];
    }) ?? [];

  console.log("trackData", trackData);

  const pitchShiftBypass = MixerMachineContext.useSelector((state) => {
    return state.context.currentTracks[trackId].pitchShiftBypass[fxId];
  });

  const pitchShiftMix = MixerMachineContext.useSelector((state) => {
    return state.context.currentTracks[trackId].pitchShiftMix[fxId];
  });

  const pitchShiftPitch = MixerMachineContext.useSelector((state) => {
    return state.context.currentTracks[trackId].pitchShiftPitch[fxId];
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
    currentTracks[trackId].pitchShiftBypass[fxId] = checked;
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
    currentTracks[trackId].pitchShiftMix[fxId] = value;
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
    currentTracks[trackId].pitchShiftPitch[fxId] = value;
    localStorageSet("currentTracks", currentTracks);
  }

  // !!! --- RECORD --- !!! //
  const data = useWrite({
    id: trackId,
    fxId,
    param: "pitchShift",
    param1: pitchShiftMix,
    param2: pitchShiftPitch,
  });

  // !!! --- PLAYBACK --- !!! //
  useEffect(() => {
    if (playbackMode !== "read") return;
    playbackLoop.current = new Loop(() => {
      if (!trackData.data) return;
      console.log("automating!!!");

      function assignParam(trackId, data) {
        t.schedule((time) => {
          if (playbackMode !== "read") return;
          Draw.schedule(() => {
            send({
              type: "SET_TRACK_PITCHSHIFT_MIX",
              value: data.param1,
              pitchShift,
              trackId,
              fxId,
            });

            send({
              type: "SET_TRACK_PITCHSHIFT_PITCH",
              value: data.param2,
              pitchShift,
              trackId,
              fxId,
            });
          }, time);
        }, data.time);
      }

      trackData.data?.forEach((data) => {
        assignParam(trackId, data);
      });
    }, 1).start(0);

    return () => {
      playbackLoop.current?.dispose();
    };
  }, [send, trackId, trackData, pitchShift, fxId, data, playbackMode]);

  return (
    <div>
      <div className="flex gap12">
        <h3>Pitch Shift</h3>
        <div className="power-button">
          <CheckBox
            id={`track${trackId}pitchShiftBypass`}
            onChange={toggleBypass}
            checked={pitchShiftBypass}
          >
            {powerIcon}
          </CheckBox>
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
