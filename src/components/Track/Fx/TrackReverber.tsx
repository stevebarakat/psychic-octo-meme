import { useEffect, useCallback } from "react";
import { MixerMachineContext } from "@/context/MixerMachineContext";
import { localStorageGet, localStorageSet } from "@/utils";
import { powerIcon } from "@/assets/icons";
import useWrite from "@/hooks/useWrite";
import PlaybackMode from "@/components/FxPlaybackMode";
import type { Reverb } from "tone";
import { Toggle } from "@/components/Buttons";
import { Transport as t } from "tone";

type Props = {
  reverb: Reverb | null;
  trackId: number;
  fxId: number;
};

type ReadProps = {
  trackId: number;
};

export default function Reverber({ reverb, trackId, fxId }: Props) {
  const { send } = MixerMachineContext.useActorRef();

  const reverbBypass = MixerMachineContext.useSelector((state) => {
    return state.context.currentTracks[trackId].reverbSettings.reverbBypass[
      fxId
    ];
  });

  const reverbMix = MixerMachineContext.useSelector((state) => {
    return state.context.currentTracks[trackId].reverbSettings.reverbMix[fxId];
  });

  const reverbPreDelay = MixerMachineContext.useSelector((state) => {
    return state.context.currentTracks[trackId].reverbSettings.reverbPreDelay[
      fxId
    ];
  });

  const reverbDecay = MixerMachineContext.useSelector((state) => {
    return state.context.currentTracks[trackId].reverbSettings.reverbDecay[
      fxId
    ];
  });

  function toggleBypass(e: React.FormEvent<HTMLInputElement>): void {
    const checked = e.currentTarget.checked;
    send({
      type: "SET_TRACK_REVERB_BYPASS",
      checked,
      reverb: reverb!,
      trackId,
      fxId,
    });
  }

  function setMix(e: React.FormEvent<HTMLInputElement>): void {
    const value = parseFloat(e.currentTarget.value);
    send({
      type: "SET_TRACK_REVERB_MIX",
      value,
      reverb: reverb!,
      trackId,
      fxId,
    });
  }

  function saveMix(e: React.FormEvent<HTMLInputElement>): void {
    const value = parseFloat(e.currentTarget.value);
    const currentTracks = localStorageGet("currentTracks");
    currentTracks[trackId].reverbSettings.reverbMix[fxId] = value;
    localStorageSet("currentTracks", currentTracks);
  }

  function setPreDelay(e: React.FormEvent<HTMLInputElement>): void {
    const value = parseFloat(e.currentTarget.value);
    send({
      type: "SET_TRACK_REVERB_PREDELAY",
      value,
      reverb: reverb!,
      trackId,
      fxId,
    });
  }

  function savePreDelay(e: React.FormEvent<HTMLInputElement>): void {
    const value = parseFloat(e.currentTarget.value);
    const currentTracks = localStorageGet("currentTracks");
    currentTracks[trackId].reverbSettings.reverbPreDelay[fxId] = value;
    localStorageSet("currentTracks", currentTracks);
  }

  function setDecay(e: React.FormEvent<HTMLInputElement>): void {
    const value = parseFloat(e.currentTarget.value);
    send({
      type: "SET_TRACK_REVERB_DECAY",
      value,
      reverb: reverb!,
      trackId,
      fxId,
    });
  }

  function saveDecay(e: React.FormEvent<HTMLInputElement>): void {
    const value = parseFloat(e.currentTarget.value);
    const currentTracks = localStorageGet("currentTracks");
    currentTracks[trackId].reverbSettings.reverbDecay[fxId] = value;
    localStorageSet("currentTracks", currentTracks);
  }

  // !!! --- WRITE --- !!! //
  useWrite({
    id: trackId,
    fxParam: "reverb",
    fxId,
    value: {
      playbackMode: "static",
      reverbBypass: [reverbBypass],
      reverbMix: [reverbMix],
      reverbPreDelay: [reverbPreDelay],
      reverbDecay: [reverbDecay],
    },
  });

  useRead({ trackId });

  // !!! --- READ --- !!! //
  function useRead({ trackId }: ReadProps) {
    const { send } = MixerMachineContext.useActorRef();
    const playbackMode = MixerMachineContext.useSelector(
      (state) =>
        state.context.currentTracks[trackId].reverbSettings.playbackMode
    );

    const setParam = useCallback(
      (
        trackId: number,
        data: {
          time: number;
          value: ReverbSettings;
        }
      ) => {
        t.schedule(() => {
          if (playbackMode !== "read") return;

          send({
            type: "SET_TRACK_REVERB_MIX",
            value: data.value.reverbMix[fxId],
            reverb: reverb!,
            trackId,
            fxId,
          });

          send({
            type: "SET_TRACK_REVERB_PREDELAY",
            value: data.value.reverbPreDelay[fxId],
            reverb: reverb!,
            trackId,
            fxId,
          });

          send({
            type: "SET_TRACK_REVERB_DECAY",
            value: data.value.reverbDecay[fxId],
            reverb: reverb!,
            trackId,
            fxId,
          });
        }, data.time);
      },
      [send, playbackMode]
    );

    const reverbData = localStorageGet("reverbData");

    useEffect(() => {
      if (playbackMode !== "read" || !reverbData) return;
      const objectToMap = (obj) => new Map(Object.entries(obj));
      const newReverbSettings = objectToMap(reverbData);
      for (const value of newReverbSettings) {
        console.log("value[1]", value[1]);
        setParam(value[1].id, value[1]);
      }
    }, [reverbData, setParam, playbackMode]);

    return null;
  }

  return (
    <div>
      <div className="flex gap12">
        <h3>Reverb</h3>
        <div className="power-button">
          <Toggle
            id={`reverbBypass-track${trackId}fx${fxId}`}
            onChange={toggleBypass}
            checked={reverbBypass}
          >
            {powerIcon}
          </Toggle>
        </div>
      </div>
      <div className="flex-y">
        <PlaybackMode trackId={trackId} fxId={fxId} param="reverb" />
        <label htmlFor={`track${trackId}reverbMix`}>Mix:</label>
        <input
          type="range"
          id={`track${trackId}reverbMix`}
          min={0}
          max={1}
          step={0.001}
          disabled={reverbBypass}
          value={reverbMix}
          onChange={setMix}
          onPointerUp={saveMix}
        />
      </div>
      <div className="flex-y">
        <label htmlFor={`track${trackId}reverbPreDelay`}>Pre Delay:</label>
        <input
          type="range"
          id={`track${trackId}reverbPreDelay`}
          min={0}
          max={1}
          step={0.001}
          disabled={reverbBypass}
          value={reverbPreDelay}
          onChange={setPreDelay}
          onPointerUp={savePreDelay}
        />
      </div>
      <div className="flex-y">
        <label htmlFor={`track${trackId}reverbDecay`}>Decay:</label>
        <input
          type="range"
          id={`track${trackId}reverbDecay`}
          min={0.5}
          max={20.5}
          step={0.1}
          disabled={reverbBypass}
          value={reverbDecay}
          onChange={setDecay}
          onPointerUp={saveDecay}
        />
      </div>
    </div>
  );
}
