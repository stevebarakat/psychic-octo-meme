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

type Props = { trackId: number; channels: Channel[]; param: string };

function useRead({ trackId, channels, param }: Props) {
  const { send } = MixerMachineContext.useActorRef();

  const readEvent = useRef<ToneEvent | null>(null);
  const playbackMode = MixerMachineContext.useSelector(
    (state) => state.context.currentTracks[trackId][`${param}Mode`][0]
  );

  let queryData = [];
  const paramData = useLiveQuery(async () => {
    queryData = await db.volumeData
      .where("id")
      .equals(`${param}Data${trackId}`)
      .toArray();
    return queryData[0];
  });

  const volume = MixerMachineContext.useSelector((state) => {
    return state.context.currentTracks[trackId].volume;
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
    param,
    value: volume,
  });

  // !!! --- READ --- !!! //
  useEffect(() => {
    if (playbackMode !== "read") return;
    readEvent.current = new ToneEvent(() => {
      function setParam(
        trackId: number,
        data: {
          time: number;
          value: number;
        }
      ) {
        t.schedule(() => {
          if (playbackMode !== "read") return;

          console.log("data.value", data.value);
          send({
            type: "SET_TRACK_VOLUME",
            value: data.value,
            channels,
            trackId,
          });
        }, data.time);
      }

      for (const value of paramData!.data.values()) {
        setParam(value.id, value);
      }
    }, 1).start("+0.1");

    return () => {
      readEvent.current?.dispose();
    };
  }, [send, trackId, paramData, channels, playbackMode]);

  return { fx, saveTrackFx };
}

export default useRead;
