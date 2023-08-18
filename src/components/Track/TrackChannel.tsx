import { useRef, useEffect } from "react";
import {
  Reverb,
  FeedbackDelay,
  PitchShift,
  Gain,
  ToneEvent,
  Draw,
  Transport as t,
} from "tone";
import TrackFxSelect from "./TrackFxSelect";
import useTrackFx from "./hooks/useTrackFx";
import useSaveTrackFx from "./hooks/useSaveTrackFx";
import PlaybackMode from "../PlaybackMode";
import Pan from "./Pan";
import SoloMute from "./SoloMute";
import Sends from "./Sends";
import Fader from "./Fader";
import ChannelLabel from "../ChannelLabel";
import { MixerMachineContext } from "@/context/MixerMachineContext";
import useRecord from "@/hooks/useRecord";
import { useLiveQuery } from "dexie-react-hooks";
import { db } from "@/db";

type Props = {
  track: SourceTrack;
  trackId: number;
  channels: Channel[];
  busChannels: BusChannel[];
};

function TrackChannel({ track, trackId, channels, busChannels }: Props) {
  const { send } = MixerMachineContext.useActorRef();
  const channel = channels[trackId];

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

  const fx = useTrackFx(trackId, channel, trackFx);
  const saveTrackFx = useSaveTrackFx(trackId);

  // !!! --- WRITE --- !!! //
  useRecord({
    id: trackId,
    fxId: 0,
    channelType: "currentTracks",
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
            channel,
            trackId,
          });

          send({
            type: "TOGGLE_SOLO",
            checked: data.param3,
            channel,
            trackId,
          });

          send({
            type: "TOGGLE_MUTE",
            checked: data.param4,
            channel,
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
  }, [send, trackId, volumeData, channels, channel, playbackMode]);

  return (
    <div className="flex-y gap2">
      <TrackFxSelect trackId={trackId} fx={fx} saveTrackFx={saveTrackFx} />
      <div className="channel">
        <Sends
          trackId={trackId}
          channels={channels}
          busChannels={busChannels}
        />
        <Pan trackId={trackId} channel={channel} />
        <Fader trackId={trackId} channels={channels} />
        <SoloMute trackId={trackId} channel={channel} />
        <ChannelLabel channelName={track.name} />
      </div>
      <PlaybackMode trackId={trackId} fxId={0} param="volume" />
    </div>
  );
}

export default TrackChannel;
