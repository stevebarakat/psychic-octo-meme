import Solo from "./Solo";
import Mute from "./Mute";
import PlaybackMode from "../../PlaybackMode";
import useAutomationData from "@/hooks/useSoloMuteAutomationData";

type Props = {
  trackId: number;
  channels: Channel[];
};

function SoloMute({ trackId, channels }: Props) {
  useAutomationData({ trackId, channels, param: "soloMute" });

  return (
    <div>
      <div className="solo-mute">
        <Solo trackId={trackId} channels={channels} />
        <Mute trackId={trackId} channels={channels} />
      </div>
      <PlaybackMode trackId={trackId} param="soloMute" />
    </div>
  );
}

export default SoloMute;
