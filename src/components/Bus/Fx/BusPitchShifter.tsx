import { useRef, useEffect } from "react";
import { MixerMachineContext } from "@/context/MixerMachineContext";
import { localStorageGet, localStorageSet } from "@/utils";
import { powerIcon } from "@/assets/icons";
import BusPlaybackMode from "@/components/BusPlaybackMode";
import useRecord from "@/hooks/useRecord";
import type { PitchShift } from "tone";
import CheckBox from "@/components/CheckBox";
import { Loop, Draw, Transport as t } from "tone";
import { useLiveQuery } from "dexie-react-hooks";
import { db } from "@/db";

type Props = {
  pitchShift: PitchShift | null;
  busId: number;
  fxId: number;
};

export default function PitchShifter({ pitchShift, busId, fxId }: Props) {
  const { send } = MixerMachineContext.useActorRef();

  const playbackLoop = useRef<Loop | null>(null);
  const playbackMode = MixerMachineContext.useSelector(
    (state) => state.context.currentBuses[busId]["pitchShiftMode"][fxId]
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
      queryData = await db["busPitchShiftData"]
        .where("id")
        .equals(`pitchShiftData${busId}`)
        .toArray();
      return queryData[0];
    }) ?? [];

  const pitchShiftBypass = MixerMachineContext.useSelector((state) => {
    return state.context.currentBuses[busId].pitchShiftBypass[fxId];
  });

  const pitchShiftMix = MixerMachineContext.useSelector((state) => {
    return state.context.currentBuses[busId].pitchShiftMix[fxId];
  });

  const pitchShiftPitch = MixerMachineContext.useSelector((state) => {
    return state.context.currentBuses[busId].pitchShiftPitch[fxId];
  });

  function toggleBypass(e: React.FormEvent<HTMLInputElement>): void {
    const checked = e.currentTarget.checked;
    send({
      type: "SET_BUS_PITCHSHIFT_BYPASS",
      checked,
      pitchShift,
      busId,
      fxId,
    });
    const currentBuses = localStorageGet("currentBuses");
    currentBuses[busId].pitchShiftBypass[fxId] = checked;
    localStorageSet("currentBuses", currentBuses);
  }

  function setMix(e: React.FormEvent<HTMLInputElement>): void {
    const value = parseFloat(e.currentTarget.value);
    send({
      type: "SET_BUS_PITCHSHIFT_MIX",
      value,
      pitchShift,
      busId,
      fxId,
    });
  }
  function saveMix(e: React.FormEvent<HTMLInputElement>): void {
    const value = parseFloat(e.currentTarget.value);
    const currentBuses = localStorageGet("currentBuses");
    currentBuses[busId].pitchShiftMix[fxId] = value;
    localStorageSet("currentBuses", currentBuses);
  }

  function setPitch(e: React.FormEvent<HTMLInputElement>): void {
    const value = parseFloat(e.currentTarget.value);
    send({
      type: "SET_BUS_PITCHSHIFT_PITCH",
      value,
      pitchShift,
      busId,
      fxId,
    });
  }

  function savePitch(e: React.FormEvent<HTMLInputElement>): void {
    const value = parseFloat(e.currentTarget.value);
    const currentBuses = localStorageGet("currentBuses");
    currentBuses[busId].pitchShiftPitch[fxId] = value;
    localStorageSet("currentBuses", currentBuses);
  }

  // !!! --- RECORD --- !!! //
  const data = useRecord({
    id: busId,
    fxId,
    channelType: "currentBuses",
    param: "pitchShift",
    param1: pitchShiftMix,
    param2: pitchShiftPitch,
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
              type: "SET_BUS_PITCHSHIFT_MIX",
              value: data.param1,
              pitchShift,
              busId,
              fxId,
            });

            send({
              type: "SET_BUS_PITCHSHIFT_PITCH",
              value: data.param2,
              pitchShift,
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
  }, [send, busId, trackData, pitchShift, fxId, data, playbackMode]);

  return (
    <div>
      <div className="flex gap12">
        <h3>Pitch Shift</h3>
        <div className="power-button">
          <CheckBox
            id={`pitchShiftBypass-bus${busId}fx${fxId}`}
            checked={pitchShiftBypass}
            onChange={toggleBypass}
          >
            {powerIcon}
          </CheckBox>
        </div>
      </div>
      <div className="flex-y">
        <BusPlaybackMode busId={busId} fxId={fxId} param="pitchShift" />
        <label htmlFor={`bus${busId}pitchShiftMix`}>Mix:</label>
        <input
          type="range"
          id={`bus${busId}pitchShiftMix`}
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
        <label htmlFor={`bus${busId}pitchShiftPitch`}>Pitch:</label>
        <input
          type="range"
          id={`bus${busId}pitchShiftPitch`}
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
