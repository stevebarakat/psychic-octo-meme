import { useRef, useEffect } from "react";
import {
  Reverb,
  FeedbackDelay,
  PitchShift,
  Gain,
  ToneEvent,
  Transport as t,
} from "tone";
import useTrackFx from "@/hooks/useTrackFx";
import useSaveTrackFx from "@/hooks/useSaveTrackFx";
import { MixerMachineContext } from "@/context/MixerMachineContext";
import useWrite from "@/hooks/useWrite";
import { useLiveQuery } from "dexie-react-hooks";
import { db } from "@/db";

function useRead(trackId: number, channels: Channel[]) {
  const { send } = MixerMachineContext.useActorRef();

  const readEvent = useRef<ToneEvent | null>(null);
  const playbackMode = MixerMachineContext.useSelector(
    (state) => state.context.currentTracks[trackId]["volumeMode"][0]
  );

  let queryData = [];
  const volumeData = useLiveQuery(async () => {
    queryData = await db.volumeData
      .where("id")
      .equals(`volumeData${trackId}`)
      .toArray();
    return queryData[0];
  });

  const volume = MixerMachineContext.useSelector((state) => {
    return state.context.currentTracks[trackId].volume;
  });

  const pan = MixerMachineContext.useSelector((state) => {
    return state.context.currentTracks[trackId].pan;
  });

  const solo = MixerMachineContext.useSelector((state) => {
    return state.context.currentTracks[trackId].solo;
  });

  const mute = MixerMachineContext.useSelector((state) => {
    return state.context.currentTracks[trackId].mute;
  });

  type TrackFx = {
    nofx: Gain | null;
    reverb: Reverb | null;
    delay: FeedbackDelay | null;
    pitchShift: PitchShift | null;
  };

  const trackFx: TrackFx = {
    nofx: null,
    reverb: null,
    delay: null,
    pitchShift: null,
  };

  const fx = useTrackFx(trackId, channels[trackId], trackFx);
  const saveTrackFx = useSaveTrackFx(trackId);

  // !!! --- WRITE --- !!! //
  useWrite({
    id: trackId,
    fxId: 0,
    param: "volume",
    param1: volume,
    param2: pan,
    param3: solo,
    param4: mute,
  });

  // !!! --- READ --- !!! //
  useEffect(() => {
    if (playbackMode !== "read") return;
    readEvent.current = new ToneEvent(() => {
      function setParam(
        trackId: number,
        data: {
          time: number;
          param1: number;
          param2: number;
          param3: boolean;
          param4: boolean;
        }
      ) {
        t.schedule(() => {
          if (playbackMode !== "read") return;

          console.log("data.param1", data.param1);
          send({
            type: "SET_TRACK_VOLUME",
            value: data.param1,
            channels,
            trackId,
          });

          send({
            type: "SET_PAN",
            value: data.param2,
            channel: channels[trackId],
            trackId,
          });

          send({
            type: "TOGGLE_SOLO",
            checked: data.param3,
            channel: channels[trackId],
            trackId,
          });

          send({
            type: "TOGGLE_MUTE",
            checked: data.param4,
            channel: channels[trackId],
            trackId,
          });
        }, data.time);
      }

      for (const value of volumeData!.data.values()) {
        setParam(value.id, value);
      }
    }, 1).start("+0.1");

    return () => {
      readEvent.current?.dispose();
    };
  }, [send, trackId, volumeData, channels, playbackMode]);

  return { fx, saveTrackFx };
}

export default useRead;
