import Solo from "./Solo";
import Mute from "./Mute";
import PlaybackMode from "../../PlaybackMode";

type Props = {
  trackId: number;
  channel: Channel;
};

function index({ trackId, channel }: Props) {
  return (
    <div>
      <div className="solo-mute">
        <Solo trackId={trackId} channel={channel} />
        <Mute trackId={trackId} channel={channel} />
      </div>
      <PlaybackMode trackId={trackId} param="solo" />
    </div>
  );
}

export default index;
