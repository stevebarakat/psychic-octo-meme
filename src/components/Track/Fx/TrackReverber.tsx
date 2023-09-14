import { useEffect, useCallback } from "react";
import { MixerMachineContext } from "@/context/MixerMachineContext";
import { powerIcon } from "@/assets/icons";
import useWrite from "@/hooks/useWrite";
import PlaybackMode from "@/components/FxPlaybackMode";
import type { Reverb } from "tone";
import { Toggle } from "@/components/Buttons";
import { Transport as t } from "tone";
import { useLiveQuery } from "dexie-react-hooks";
import { db } from "@/db";

type Props = {
  reverb: Reverb;
  trackId: number;
};

type ReadProps = {
  trackId: number;
};

export default function Reverber({ reverb, trackId }: Props) {
  const { send } = MixerMachineContext.useActorRef();

  const reverbBypass = MixerMachineContext.useSelector((state) => {
    return state.context.currentTracks[trackId].reverbSettings.reverbBypass;
  });

  const reverbMix = MixerMachineContext.useSelector((state) => {
    return state.context.currentTracks[trackId].reverbSettings.reverbMix;
  });

  const reverbPreDelay = MixerMachineContext.useSelector((state) => {
    return state.context.currentTracks[trackId].reverbSettings.reverbPreDelay;
  });

  const reverbDecay = MixerMachineContext.useSelector((state) => {
    return state.context.currentTracks[trackId].reverbSettings.reverbDecay;
  });

  function toggleBypass(e: React.FormEvent<HTMLInputElement>): void {
    const checked = e.currentTarget.checked;
    send({
      type: "SET_TRACK_REVERB_BYPASS",
      checked,
      reverb,
      trackId,
    });
  }

  function setMix(e: React.FormEvent<HTMLInputElement>): void {
    const value = parseFloat(e.currentTarget.value);
    send({
      type: "SET_TRACK_REVERB_MIX",
      value,
      reverb,
      trackId,
    });
  }

  function setPreDelay(e: React.FormEvent<HTMLInputElement>): void {
    const value = parseFloat(e.currentTarget.value);
    send({
      type: "SET_TRACK_REVERB_PREDELAY",
      value,
      reverb,
      trackId,
    });
  }

  function setDecay(e: React.FormEvent<HTMLInputElement>): void {
    const value = parseFloat(e.currentTarget.value);
    send({
      type: "SET_TRACK_REVERB_DECAY",
      value,
      reverb,
      trackId,
    });
  }

  // !!! --- WRITE --- !!! //
  useWrite({
    id: trackId,
    fxParam: "reverb",
    value: {
      playbackMode: "static",
      reverbBypass: reverbBypass,
      reverbMix: reverbMix,
      reverbPreDelay: reverbPreDelay,
      reverbDecay: reverbDecay,
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
            value: data.value.reverbMix,
            reverb: reverb!,
            trackId,
          });

          send({
            type: "SET_TRACK_REVERB_PREDELAY",
            value: data.value.reverbPreDelay,
            reverb: reverb!,
            trackId,
          });

          send({
            type: "SET_TRACK_REVERB_DECAY",
            value: data.value.reverbDecay,
            reverb: reverb!,
            trackId,
          });
        }, data.time);
      },
      [send, playbackMode]
    );

    let queryData = [];
    const reverbData = useLiveQuery(async () => {
      queryData = await db.reverbData
        .where("id")
        .equals(`reverbData${trackId}`)
        .toArray();
      return queryData[0];
    });

    useEffect(() => {
      if (playbackMode !== "read" || !reverbData) return;
      for (const value of reverbData.data.values()) {
        setParam(value.id, value);
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
            id={`reverbBypass-track${trackId}`}
            onChange={toggleBypass}
            checked={reverbBypass}
          >
            {powerIcon}
          </Toggle>
        </div>
      </div>
      <div className="flex-y">
        <PlaybackMode trackId={trackId} param="reverb" />
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
        />
      </div>
    </div>
  );
}
