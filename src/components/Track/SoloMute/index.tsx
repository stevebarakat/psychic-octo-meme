import Solo from "./Solo";
import Mute from "./Mute";
import PlaybackMode from "../../PlaybackMode";
import useAutomationData from "@/hooks/useAutomationData";

type Props = {
  trackId: number;
  channels: Channel[];
};

function SoloMute({ trackId, channels }: Props) {
  useAutomationData({ trackId, channels, param: "solo" });

  return (
    <div>
      <div className="solo-mute">
        <Solo trackId={trackId} channel={channels[trackId]} />
        <Mute trackId={trackId} channel={channels[trackId]} />
      </div>
      <PlaybackMode trackId={trackId} param="solo" />
    </div>
  );
}

export default SoloMute;
