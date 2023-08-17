import { useRef, useEffect } from "react";
import { MixerMachineContext } from "@/context/MixerMachineContext";
import { localStorageGet, localStorageSet } from "@/utils";
import { powerIcon } from "@/assets/icons";
import useRecord from "@/hooks/useRecord";
import BusPlaybackMode from "@/components/BusPlaybackMode";
import type { FeedbackDelay } from "tone";
import CheckBox from "@/components/CheckBox";
import { Loop, Draw, Transport as t } from "tone";
import { useLiveQuery } from "dexie-react-hooks";
import { db } from "@/db";

type Props = {
  delay: FeedbackDelay | null;
  busId: number;
  fxId: number;
};

export default function Delay({ delay, busId, fxId }: Props) {
  const { send } = MixerMachineContext.useActorRef();

  const playbackLoop = useRef<Loop | null>(null);
  const playbackMode = MixerMachineContext.useSelector(
    (state) => state.context.currentBuses[busId]["delayMode"][fxId]
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
      queryData = await db["busDelayData"]
        .where("id")
        .equals(`delayData${busId}`)
        .toArray();
      return queryData[0];
    }) ?? [];

  const delayBypass = MixerMachineContext.useSelector((state) => {
    return state.context.currentBuses[busId].delayBypass[fxId];
  });
  const delayMix = MixerMachineContext.useSelector((state) => {
    console.log("fxId", fxId);
    console.log(
      " state.context.currentBuses[busId]",
      state.context.currentBuses[busId]
    );
    return state.context.currentBuses[busId].delayMix[fxId];
  });

  const delayTime = MixerMachineContext.useSelector((state) => {
    return state.context.currentBuses[busId].delayTime[fxId];
  });

  const delayFeedback = MixerMachineContext.useSelector((state) => {
    return state.context.currentBuses[busId].delayFeedback[fxId];
  });

  function toggleBypass(e: React.FormEvent<HTMLInputElement>): void {
    const checked = e.currentTarget.checked;
    send({
      type: "SET_BUS_DELAY_BYPASS",
      checked,
      delay,
      busId,
      fxId,
    });
    const currentBuses = localStorageGet("currentBuses");
    currentBuses[busId].delayBypass[fxId] = checked;
    localStorageSet("currentBuses", currentBuses);
  }

  function setMix(e: React.FormEvent<HTMLInputElement>): void {
    const value = parseFloat(e.currentTarget.value);
    send({
      type: "SET_BUS_DELAY_MIX",
      value,
      delay,
      busId,
      fxId,
    });
  }

  function saveMix(e: React.FormEvent<HTMLInputElement>): void {
    const value = parseFloat(e.currentTarget.value);
    const currentBuses = localStorageGet("currentBuses");
    currentBuses[busId].delayMix[fxId] = value;
    localStorageSet("currentBuses", currentBuses);
  }

  function setDelayTime(e: React.FormEvent<HTMLInputElement>): void {
    const value = parseFloat(e.currentTarget.value);
    send({
      type: "SET_BUS_DELAY_TIME",
      value,
      delay,
      busId,
      fxId,
    });
  }

  function saveDelayTime(e: React.FormEvent<HTMLInputElement>): void {
    const value = parseFloat(e.currentTarget.value);
    const currentBuses = localStorageGet("currentBuses");
    currentBuses[busId].delayTime[fxId] = value;
    localStorageSet("currentBuses", currentBuses);
  }

  function setFeedback(e: React.FormEvent<HTMLInputElement>): void {
    const value = parseFloat(e.currentTarget.value);
    send({
      type: "SET_BUS_DELAY_FEEDBACK",
      value,
      delay,
      busId,
      fxId,
    });
  }

  function saveFeedback(e: React.FormEvent<HTMLInputElement>): void {
    const value = parseFloat(e.currentTarget.value);
    const currentBuses = localStorageGet("currentBuses");
    currentBuses[busId].delayFeedback[fxId] = value;
    localStorageSet("currentBuses", currentBuses);
  }

  // !!! --- RECORD --- !!! //
  const data = useRecord({
    id: busId,
    fxId,
    channelType: "currentBuses",
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

      function assignParam(busId, data) {
        t.schedule((time) => {
          if (playbackMode !== "read") return;

          Draw.schedule(() => {
            send({
              type: "SET_BUS_DELAY_MIX",
              value: data.param1,
              delay,
              busId,
              fxId,
            });

            send({
              type: "SET_BUS_DELAY_TIME",
              value: data.param2,
              delay,
              busId,
              fxId,
            });

            send({
              type: "SET_BUS_DELAY_FEEDBACK",
              value: data.param3,
              delay,
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
  }, [send, busId, trackData, delay, fxId, data, playbackMode]);

  return (
    <div>
      <div className="flex gap12">
        <h3>Delay</h3>
        <div className="power-button">
          <CheckBox
            id={`delayBypass-bus${busId}fx${fxId}`}
            checked={delayBypass}
            onChange={toggleBypass}
          >
            {powerIcon}
          </CheckBox>
        </div>
      </div>
      <div className="flex-y">
        <BusPlaybackMode busId={busId} fxId={fxId} param="delay" />
        <label htmlFor={`bus${busId}delayMix`}>Mix:</label>
        <input
          type="range"
          id={`bus${busId}delayMix`}
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
        <label htmlFor={`bus${busId}delayMix`}>Delay Time:</label>
        <input
          type="range"
          id={`bus${busId}delayMix`}
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
        <label htmlFor={`bus${busId}delayFeedback`}>Feedback:</label>
        <input
          type="range"
          id={`bus${busId}delayFeedback`}
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
