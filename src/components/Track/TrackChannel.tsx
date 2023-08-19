import TrackFxSelect from "./TrackFxSelect";
import PlaybackMode from "../PlaybackMode";
import Pan from "./Pan";
import SoloMute from "./SoloMute";
import Fader from "./Fader";
import ChannelLabel from "../ChannelLabel";
import useRead from "@/hooks/useRead";

type Props = {
  track: SourceTrack;
  trackId: number;
  channels: Channel[];
  busChannels: BusChannel[];
};

function TrackChannel({ track, trackId, channels }: Props) {
  // const { fx } = useRead({ trackId, channels, param: "pan" });
  return (
    <div className="flex-y gap2">
      <TrackFxSelect trackId={trackId} channels={channels} />
      <div className="channel">
        <Pan trackId={trackId} channels={channels} />
        <Fader trackId={trackId} channels={channels} />
        <SoloMute trackId={trackId} channel={channels[trackId]} />
        <ChannelLabel channelName={track.name} />
      </div>
    </div>
  );
}

export default TrackChannel;
