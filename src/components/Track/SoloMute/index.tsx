import Solo from "./Solo";
import Mute from "./Mute";
import PlaybackMode from "../../PlaybackMode";
import useSoloMuteAutomationData from "@/hooks/useSoloMuteAutomationData";

type Props = {
  trackId: number;
  channels: Channel[];
};

function SoloMute({ trackId, channels }: Props) {
  useSoloMuteAutomationData({ trackId, channels });

  return (
    <div>
      <PlaybackMode trackId={trackId} param="soloMute" />
      <div className="solo-mute">
        <Solo trackId={trackId} />
        <Mute trackId={trackId} />
      </div>
    </div>
  );
}

export default SoloMute;
