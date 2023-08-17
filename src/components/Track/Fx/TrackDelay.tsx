import { useRef, useEffect } from "react";
import { MixerMachineContext } from "@/context/MixerMachineContext";
import { localStorageGet, localStorageSet } from "@/utils";
import { powerIcon } from "@/assets/icons";
import useRecord from "@/hooks/useRecord";
import PlaybackMode from "@/components/PlaybackMode";
import type { FeedbackDelay } from "tone";
import CheckBox from "@/components/CheckBox";
import { Loop, Draw, Transport as t } from "tone";
import { useLiveQuery } from "dexie-react-hooks";
import { db } from "@/db";

type Props = {
  delay: FeedbackDelay | null;
  trackId: number;
  fxId: number;
};

export default function Delay({ delay, trackId, fxId }: Props) {
  const { send } = MixerMachineContext.useActorRef();

  const playbackLoop = useRef<Loop | null>(null);
  const playbackMode = MixerMachineContext.useSelector(
    (state) => state.context.currentTracks[trackId]["delayMode"][fxId]
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
      queryData = await db["delayData"]
        .where("id")
        .equals(`delayData${trackId}`)
        .toArray();
      return queryData[0];
    }) ?? [];

  const delayMix = MixerMachineContext.useSelector((state) => {
    return state.context.currentTracks[trackId].delayMix[fxId];
  });

  const delayBypass = MixerMachineContext.useSelector((state) => {
    return state.context.currentTracks[trackId].delayBypass[fxId];
  });

  const delayTime = MixerMachineContext.useSelector((state) => {
    return state.context.currentTracks[trackId].delayTime[fxId];
  });

  const delayFeedback = MixerMachineContext.useSelector((state) => {
    return state.context.currentTracks[trackId].delayFeedback[fxId];
  });

  function toggleBypass(e: React.FormEvent<HTMLInputElement>): void {
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
    currentTracks[trackId].delayMix[fxId] = value;
    localStorageSet("currentTracks", currentTracks);
  }

  function setDelayTime(e: React.FormEvent<HTMLInputElement>): void {
    const value = parseFloat(e.currentTarget.value);
    send({
      type: "SET_TRACK_DELAY_TIME",
      value,
      delay,
      trackId,
      fxId,
    });
  }

  function saveDelayTime(e: React.FormEvent<HTMLInputElement>): void {
    const value = parseFloat(e.currentTarget.value);
    const currentTracks = localStorageGet("currentTracks");
    currentTracks[trackId].delayTime[fxId] = value;
    localStorageSet("currentTracks", currentTracks);
  }

  function setFeedback(e: React.FormEvent<HTMLInputElement>): void {
    const value = parseFloat(e.currentTarget.value);
    send({
      type: "SET_TRACK_DELAY_FEEDBACK",
      value,
      delay,
      trackId,
      fxId,
    });
  }

  function saveFeedback(e: React.FormEvent<HTMLInputElement>): void {
    const value = parseFloat(e.currentTarget.value);
    const currentTracks = localStorageGet("currentTracks");
    currentTracks[trackId].delayFeedback[fxId] = value;
    localStorageSet("currentTracks", currentTracks);
  }

  // !!! --- RECORD --- !!! //
  const data = useRecord({
    id: trackId,
    fxId,
    channelType: "currentTracks",
    param: "delay",
    param1: delayMix,
    param2: delayTime,
    param3: delayFeedback,
  });

  // !!! --- PLAYBACK --- !!! //
  useEffect(() => {
    if (playbackMode !== "read") return;
    playbackLoop.current = new Loop(() => {
      if (!trackData.data) return;

      function assignParam(trackId, data) {
        t.schedule((time) => {
          if (playbackMode !== "read") return;

          Draw.schedule(() => {
            send({
              type: "SET_TRACK_DELAY_MIX",
              value: data.param1,
              delay,
              trackId,
              fxId,
            });

            send({
              type: "SET_TRACK_DELAY_TIME",
              value: data.param2,
              delay,
              trackId,
              fxId,
            });

            send({
              type: "SET_TRACK_DELAY_FEEDBACK",
              value: data.param3,
              delay,
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
  }, [send, trackId, trackData, delay, fxId, data, playbackMode]);

  return (
    <div>
      <div className="flex gap12">
        <h3>Delay</h3>
        <div className="power-button">
          <CheckBox
            id={`delayBypass-track${trackId}fx${fxId}`}
            onChange={toggleBypass}
            checked={delayBypass}
          >
            {powerIcon}
          </CheckBox>
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
