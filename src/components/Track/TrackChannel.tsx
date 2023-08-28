import TrackFxSelect from "./TrackFxSelect";
import PlaybackMode from "../PlaybackMode";
import Pan from "./Pan";
import SoloMute from "./SoloMute";
import Fader from "./Fader";
import ChannelLabel from "../ChannelLabel";
import useAutomationData from "@/hooks/useTrackAutomationData";

type Props = {
  track: SourceTrack;
  trackId: number;
  channels: Channel[];
};

function TrackChannel({ track, trackId, channels }: Props) {
  useAutomationData({ trackId, channels });
  return (
    <div className="flex-y gap2">
      {/* <TrackFxSelect trackId={trackId} channels={channels} /> */}
      <div className="channel">
        <Pan trackId={trackId} channels={channels} />
        <Fader trackId={trackId} channels={channels} />
        <SoloMute trackId={trackId} channels={channels} />
        <ChannelLabel channelName={track.name} />
      </div>
      <PlaybackMode trackId={trackId} param="volume" />
    </div>
  );
}

export default TrackChannel;
