import { useState } from "react";
import TrackFxSelect from "./TrackFxSelect";
import PlaybackMode from "../PlaybackMode";
import Pan from "./Pan";
import SoloMute from "./SoloMute";
import Fader from "./Fader";
import ChannelLabel from "../ChannelLabel";
import useAutomationData from "@/hooks/useTrackAutomationData";
import { ChannelButton } from "../Buttons";
import { array, localStorageGet, localStorageSet } from "@/utils";
import { MixerMachineContext } from "@/context/MixerMachineContext";
import { useDelay } from "./Fx";
import { Delay } from "./Fx";
import { TrackPanel } from "./TrackPanels";

type Props = {
  track: SourceTrack;
  trackId: number;
  channels: Channel[];
};

function TrackChannel({ track, trackId, channels }: Props) {
  useAutomationData({ trackId, channels });
  const delay = useDelay();
  const [, dispatch] = MixerMachineContext.useActor();
  const { send } = MixerMachineContext.useActorRef();
  const trackFxNames = MixerMachineContext.useSelector(
    (state) => state.context.currentTracks[trackId].fxNames
  );
  const currentTracks = localStorageGet("currentTracks");
  const disabled = currentTracks[trackId].fxNames.every(
    (item: string) => item === "nofx"
  );

  const [fxNames, setFxNames] = useState([
    ["nofx", "nofx"],
    ["nofx", "nofx"],
    ["nofx", "nofx"],
    ["nofx", "nofx"],
  ]);

  function handleClick() {
    dispatch({
      type: "SET_ACTIVE_TRACK_PANELS",
      trackId,
    });
  }
  // function saveTrackFx(e: React.FormEvent<HTMLSelectElement>): void {
  //   const fxName = e.currentTarget.value;
  //   switch (fxName) {
  //     case "delay":
  //       fxNames[trackId] = "delay";
  //       setFxNames([...fxNames]);
  //       channels[trackId].connect(delay);
  //       break;
  //     default:
  //       break;
  //   }
  // }

  function saveTrackFx(e: React.FormEvent<HTMLSelectElement>) {
    const currentTracks = localStorageGet("currentTracks");
    const fxName = e.currentTarget.value;
    const id = e.currentTarget.id.at(-1);
    const fxId = (id && parseInt(id, 10)) || 0;

    channels[trackId].connect(delay);

    trackFxNames[trackId] = fxName;
    send({
      type: "SET_TRACK_FX_NAMES",
      trackId,
      value: [...trackFxNames],
    });

    currentTracks[trackId].fxNames[fxId] = e.currentTarget.value;
    localStorageSet("currentTracks", currentTracks);
  }

  return (
    <div className="flex-y gap2">
      {/* <TrackFxSelect trackId={trackId} channels={channels} /> */}

      <>
        {currentTracks[trackId].panelActive === false && (
          <TrackPanel trackId={trackId}>
            <Delay delay={delay} trackId={trackId} fxId={0} />
          </TrackPanel>
        )}

        <ChannelButton
          className="fx-select"
          disabled={disabled}
          onClick={handleClick}
        >
          {disabled
            ? "No "
            : currentTracks[trackId].panelActive !== false
            ? "Close "
            : "Open "}
          FX
        </ChannelButton>
        {array(2).map((_, fxId) => (
          <select
            key={fxId}
            id={`track${trackId}fx${fxId}`}
            className="fx-select"
            onChange={saveTrackFx}
            value={fxNames[trackId][fxId]}
          >
            <option value={"nofx"}>{`FX ${fxId + 1}`}</option>
            <option value={"reverb"}>Reverb</option>
            <option value={"delay"}>Delay</option>
            <option value={"pitchShift"}>Pitch Shift</option>
          </select>
        ))}
      </>

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
