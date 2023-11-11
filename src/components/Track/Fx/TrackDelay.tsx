import { useEffect, useCallback } from "react";
import { MixerMachineContext } from "@/context/MixerMachineContext";
import { localStorageGet, localStorageSet } from "@/utils";
import { powerIcon } from "@/assets/icons";
import useWrite from "@/hooks/useWrite";
import PlaybackMode from "@/components/FxPlaybackMode";
import type { FeedbackDelay } from "tone";
import { Toggle } from "@/components/Buttons";
import { Transport as t } from "tone";

type Props = {
  delay: FeedbackDelay | null;
  trackId: number;
  fxId: number;
};

type ReadProps = {
  trackId: number;
};

export default function Delay({ delay, trackId, fxId }: Props) {
  const { send } = MixerMachineContext.useActorRef();

  const delayBypass = MixerMachineContext.useSelector((state) => {
    return state.context.currentTracks[trackId].delaySettings.delayBypass[fxId];
  });

  const delayMix = MixerMachineContext.useSelector((state) => {
    return state.context.currentTracks[trackId].delaySettings.delayMix[fxId];
  });

  const delayTime = MixerMachineContext.useSelector((state) => {
    return state.context.currentTracks[trackId].delaySettings.delayTime[fxId];
  });

  const delayFeedback = MixerMachineContext.useSelector((state) => {
    return state.context.currentTracks[trackId].delaySettings.delayFeedback[
      fxId
    ];
  });

  function toggleBypass(e: React.FormEvent<HTMLInputElement>): void {
    if (!delay) return;
    const checked = e.currentTarget.checked;
    send({
      type: "SET_TRACK_DELAY_BYPASS",
      checked,
      delay,
      trackId,
      fxId,
    });
    const currentTracks = localStorageGet("currentTracks");
    currentTracks[trackId].delayBypass[fxId] = checked;
    localStorageSet("currentTracks", currentTracks);
  }

  function setMix(e: React.FormEvent<HTMLInputElement>): void {
    if (!delay) return;
    const value = parseFloat(e.currentTarget.value);
    send({
      type: "SET_TRACK_DELAY_MIX",
      value,
      delay,
      trackId,
      fxId,
    });
  }

  function saveMix(e: React.FormEvent<HTMLInputElement>): void {
    const value = parseFloat(e.currentTarget.value);
    const currentTracks = localStorageGet("currentTracks");
    currentTracks[trackId].delaySettings.delayMix[fxId] = value;
  }

  function setDelayTime(e: React.FormEvent<HTMLInputElement>): void {
    if (!delay) return;
    console.log("delay", delay);
    const value = parseFloat(e.currentTarget.value);
    // delay.delayTime.value = value;
    send({
      type: "SET_TRACK_DELAY_TIME",
      value,
      delay: delay!,
      trackId,
      fxId,
    });
  }

  function saveDelayTime(e: React.FormEvent<HTMLInputElement>): void {
    const value = parseFloat(e.currentTarget.value);
    const currentTracks = localStorageGet("currentTracks");
    currentTracks[trackId].delaySettings.delayTime[fxId] = value;
    localStorageSet("currentTracks", currentTracks);
  }

  function setFeedback(e: React.FormEvent<HTMLInputElement>): void {
    if (!delay) return;
    const value = parseFloat(e.currentTarget.value);
    send({
      type: "SET_TRACK_DELAY_FEEDBACK",
      value,
      delay: delay!,
      trackId,
      fxId,
    });
  }

  function saveFeedback(e: React.FormEvent<HTMLInputElement>): void {
    const value = parseFloat(e.currentTarget.value);
    const currentTracks = localStorageGet("currentTracks");
    currentTracks[trackId].delaySettings.delayFeedback[fxId] = value;
    localStorageSet("currentTracks", currentTracks);
  }

  // !!! --- WRITE --- !!! //
  useWrite({
    id: trackId,
    fxParam: "delay",
    fxId,
    value: {
      playbackMode: "static",
      delayBypass: [delayBypass],
      delayMix: [delayMix],
      delayTime: [delayTime],
      delayFeedback: [delayFeedback],
    },
  });

  useRead({ trackId });

  // !!! --- READ --- !!! //
  function useRead({ trackId }: ReadProps) {
    const { send } = MixerMachineContext.useActorRef();
    const playbackMode = MixerMachineContext.useSelector(
      (state) => state.context.currentTracks[trackId].delaySettings.playbackMode
    );

    const setParam = useCallback(
      (
        trackId: number,
        data: {
          time: number;
          value: DelaySettings;
        }
      ) => {
        t.schedule(() => {
          if (playbackMode !== "read" || !delay) return;

          send({
            type: "SET_TRACK_DELAY_MIX",
            value: data.value.delayMix[fxId],
            delay: delay,
            trackId,
            fxId,
          });

          send({
            type: "SET_TRACK_DELAY_TIME",
            value: data.value.delayTime[fxId],
            delay: delay,
            trackId,
            fxId,
          });

          send({
            type: "SET_TRACK_DELAY_FEEDBACK",
            value: data.value.delayFeedback[fxId],
            delay: delay,
            trackId,
            fxId,
          });
        }, data.time);
      },
      [send, playbackMode]
    );

    const delayData = localStorageGet("delayData");

    useEffect(() => {
      if (playbackMode !== "read" || !delayData) return;
      const objectToMap = (obj) => new Map(Object.entries(obj));
      const newDelaySettings = objectToMap(delayData);
      for (const value of newDelaySettings) {
        console.log("value[1]", value[1]);
        setParam(value[1].id, value[1]);
      }
    }, [delayData, setParam, playbackMode]);

    return null;
  }

  return (
    <div>
      <div className="flex gap12">
        <h3>Delay</h3>
        <div className="power-button">
          <Toggle
            id={`delayBypass-track${trackId}fx${fxId}`}
            onChange={toggleBypass}
            checked={delayBypass}
          >
            {powerIcon}
          </Toggle>
        </div>
      </div>
      <div className="flex-y">
        <PlaybackMode trackId={trackId} fxId={fxId} param="delay" />
        <label htmlFor={`track${trackId}delayMix`}>Mix:</label>
        <input
          type="range"
          id={`track${trackId}delayMix`}
          min={0}
          max={1}
          step={0.01}
          disabled={delayBypass}
          value={delayMix}
          onChange={setMix}
          onPointerUp={saveMix}
        />
      </div>
      <div className="flex-y">
        <label htmlFor={`track${trackId}delayTime`}>Delay Time:</label>
        <input
          type="range"
          id={`track${trackId}delayTime`}
          min={0}
          max={1}
          step={0.01}
          disabled={delayBypass}
          value={delayTime}
          onChange={setDelayTime}
          onPointerUp={saveDelayTime}
        />
      </div>
      <div className="flex-y">
        <label htmlFor={`track${trackId}delayFeedback`}>Feedback:</label>
        <input
          type="range"
          id={`track${trackId}delayFeedback`}
          min={0}
          max={1}
          step={0.01}
          disabled={delayBypass}
          value={delayFeedback}
          onChange={setFeedback}
          onPointerUp={saveFeedback}
        />
      </div>
    </div>
  );
}
