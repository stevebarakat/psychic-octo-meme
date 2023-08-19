import Solo from "./Solo";
import Mute from "./Mute";
import { Channel } from "tone";

type Props = {
  trackId: number;
  channel: Channel;
};

function index({ trackId, channel }: Props) {
  return (
    <div className="solo-mute">
      <Solo trackId={trackId} channel={channel} />
      <Mute trackId={trackId} channel={channel} />
    </div>
  );
}

export default index;
