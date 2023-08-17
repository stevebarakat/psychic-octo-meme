import { useRef, useEffect } from "react";
import { MixerMachineContext } from "@/context/MixerMachineContext";
import { localStorageGet, localStorageSet } from "@/utils";
import { powerIcon } from "@/assets/icons";
import useRecord from "@/hooks/useRecord";
import BusPlaybackMode from "@/components/BusPlaybackMode";
import type { Reverb } from "tone";
import CheckBox from "@/components/CheckBox";
import { Loop, Draw, Transport as t } from "tone";
import { useLiveQuery } from "dexie-react-hooks";
import { db } from "@/db";

type Props = {
  reverb: Reverb | null;
  busId: number;
  fxId: number;
};

export default function Reverber({ reverb, busId, fxId }: Props) {
  const { send } = MixerMachineContext.useActorRef();

  const playbackLoop = useRef<Loop | null>(null);
  const playbackMode = MixerMachineContext.useSelector(
    (state) => state.context.currentBuses[busId]["reverbMode"][fxId]
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
      queryData = await db["busReverbData"]
        .where("id")
        .equals(`reverbData${busId}`)
        .toArray();
      return queryData[0];
    }) ?? [];

  const reverbBypass = MixerMachineContext.useSelector((state) => {
    return state.context.currentBuses[busId].reverbBypass[fxId];
  });

  const reverbMix = MixerMachineContext.useSelector((state) => {
    return state.context.currentBuses[busId].reverbMix[fxId];
  });

  const reverbPreDelay = MixerMachineContext.useSelector((state) => {
    return state.context.currentBuses[busId].reverbPreDelay[fxId];
  });

  const reverbDecay = MixerMachineContext.useSelector((state) => {
    return state.context.currentBuses[busId].reverbDecay[fxId];
  });

  function toggleBypass(e: React.FormEvent<HTMLInputElement>): void {
    const checked = e.currentTarget.checked;
    send({
      type: "SET_BUS_REVERB_BYPASS",
      checked,
      reverb,
      busId,
      fxId,
    });
    const currentBuses = localStorageGet("currentBuses");
    currentBuses[busId].reverbBypass[fxId] = checked;
    localStorageSet("currentBuses", currentBuses);
  }

  function setMix(e: React.FormEvent<HTMLInputElement>): void {
    const value = parseFloat(e.currentTarget.value);
    send({
      type: "SET_BUS_REVERB_MIX",
      value,
      reverb,
      busId,
      fxId,
    });
  }
  function saveMix(e: React.FormEvent<HTMLInputElement>): void {
    const value = parseFloat(e.currentTarget.value);
    const currentBuses = localStorageGet("currentBuses");
    currentBuses[busId].reverbMix[fxId] = value;
    localStorageSet("currentBuses", currentBuses);
  }

  function setPreDelay(e: React.FormEvent<HTMLInputElement>): void {
    const value = parseFloat(e.currentTarget.value);
    send({
      type: "SET_BUS_REVERB_PREDELAY",
      value,
      reverb,
      busId,
      fxId,
    });
  }

  function savePreDelay(e: React.FormEvent<HTMLInputElement>): void {
    const value = parseFloat(e.currentTarget.value);
    const currentBuses = localStorageGet("currentBuses");
    currentBuses[busId].reverbPreDelay[fxId] = value;
    localStorageSet("currentBuses", currentBuses);
  }

  function setDecay(e: React.FormEvent<HTMLInputElement>): void {
    const value = parseFloat(e.currentTarget.value);
    send({
      type: "SET_BUS_REVERB_DECAY",
      value,
      reverb,
      busId,
      fxId,
    });
  }

  function saveDecay(e: React.FormEvent<HTMLInputElement>): void {
    const value = parseFloat(e.currentTarget.value);
    const currentBuses = localStorageGet("currentBuses");
    currentBuses[busId].reverbDecay[fxId] = value;
    localStorageSet("currentBuses", currentBuses);
  }

  // !!! --- RECORD --- !!! //
  const data = useRecord({
    id: busId,
    fxId,
    channelType: "currentBuses",
    param: "reverb",
    param1: reverbMix,
    param2: reverbPreDelay,
    param3: reverbDecay,
  });

  // !!! --- PLAYBACK --- !!! //
  useEffect(() => {
    if (playbackMode !== "read") return;
    playbackLoop.current = new Loop(() => {
      if (!trackData.data) return;

      function assignParam(busId, data) {
        t.schedule((time) => {
          if (playbackMode !== "read") return;

          Draw.schedule(() => {
            send({
              type: "SET_BUS_REVERB_MIX",
              value: data.param1,
              reverb,
              busId,
              fxId,
            });

            send({
              type: "SET_BUS_REVERB_PREDELAY",
              value: data.param2,
              reverb,
              busId,
              fxId,
            });

            send({
              type: "SET_BUS_REVERB_DECAY",
              value: data.param3,
              reverb,
              busId,
              fxId,
            });
          }, time);
        }, data.time);
      }

      trackData.data?.forEach((data) => {
        assignParam(busId, data);
      });
    }, 1).start(0);

    return () => {
      playbackLoop.current?.dispose();
    };
  }, [send, busId, trackData, reverb, fxId, data, playbackMode]);

  return (
    <div>
      <div className="flex gap12">
        <h3>Reverb</h3>
        <div className="power-button">
          <CheckBox
            id={`reverbBypass-bus${busId}fx${fxId}`}
            checked={reverbBypass}
            onChange={toggleBypass}
          >
            {powerIcon}
          </CheckBox>
        </div>
      </div>
      <div className="flex-y">
        <BusPlaybackMode busId={busId} fxId={fxId} param="reverb" />
        <label htmlFor={`reverbMix-bus${busId}fx${fxId}`}>Mix:</label>
        <input
          type="range"
          id={`reverbMix-bus${busId}fx${fxId}`}
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
        <label htmlFor={`reverbPreDelay-bus${busId}fx${fxId}`}>
          Pre Delay:
        </label>
        <input
          type="range"
          id={`reverbPreDelay-bus${busId}fx${fxId}`}
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
        <label htmlFor={`reverbDecay-bus${busId}fx${fxId}`}>Decay:</label>
        <input
          type="range"
          id={`reverbDecay-bus${busId}fx${fxId}`}
          min={0.5}
          max={12.5}
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
