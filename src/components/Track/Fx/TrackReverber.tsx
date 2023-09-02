import { useRef, useEffect } from "react";
import { MixerMachineContext } from "@/context/MixerMachineContext";
import { localStorageGet, localStorageSet } from "@/utils";
import { powerIcon } from "@/assets/icons";
import useWrite from "@/hooks/useWrite";
import PlaybackMode from "@/components/FxPlaybackMode";
import type { Reverb } from "tone";
import { Toggle } from "@/components/Buttons";
import { Loop, Draw, Transport as t } from "tone";
import { useLiveQuery } from "dexie-react-hooks";
import { db } from "@/db";

type Props = {
  reverb: Reverb | null;
  trackId: number;
  fxId: number;
};

export default function Reverber({ reverb, trackId, fxId }: Props) {
  const { send } = MixerMachineContext.useActorRef();

  const playbackLoop = useRef<Loop | null>(null);
  const playbackMode = MixerMachineContext.useSelector(
    (state) =>
      state.context.currentTracks[trackId].reverbSettings.playbackMode[fxId]
  );

  let queryData = [];
  const trackData = useLiveQuery(async () => {
    queryData = await db["reverbData"]
      .where("id")
      .equals(`reverbData${trackId}`)
      .toArray();
    return queryData[0];
  });

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

  // !!! --- RECORD --- !!! //
  const data = useWrite({
    id: trackId,
    fxParam: "reverb",
    fxId,
    reverbSettings: {
      playbackMode: "static",
      reverbBypass: [reverbBypass],
      reverbMix: [reverbMix],
      reverbPreDelay: [reverbPreDelay],
      reverbDecay: [reverbDecay],
    },
  });

  // !!! --- PLAYBACK --- !!! //
  useEffect(() => {
    if (playbackMode !== "read") return;
    playbackLoop.current = new Loop(() => {
      if (!trackData?.data) return;

      function assignParam(trackId: number, data) {
        t.schedule((time) => {
          if (playbackMode !== "read") return;

          Draw.schedule(() => {
            send({
              type: "SET_TRACK_REVERB_MIX",
              value: data.reverbSettings.reverbMix,
              reverb: reverb!,
              trackId,
              fxId,
            });

            send({
              type: "SET_TRACK_REVERB_PREDELAY",
              value: data.reverbSettings.reverbPreDelay,
              reverb: reverb!,
              trackId,
              fxId,
            });

            send({
              type: "SET_TRACK_REVERB_DECAY",
              value: data.reverbSettings.reverbDecay,
              reverb: reverb!,
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
  }, [send, trackId, trackData, reverb, fxId, data, playbackMode]);

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
