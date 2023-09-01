import { useState } from "react";
import TrackFxSelect from "./TrackFxSelect";
import { Zero } from "tone";
import PlaybackMode from "../PlaybackMode";
import Pan from "./Pan";
import SoloMute from "./SoloMute";
import Fader from "./Fader";
import ChannelLabel from "../ChannelLabel";
import useAutomationData from "@/hooks/useTrackAutomationData";
import { ChannelButton } from "../Buttons";
import { array, localStorageGet, localStorageSet } from "@/utils";
import { MixerMachineContext } from "@/context/MixerMachineContext";
import { TrackPanel } from "./TrackPanels";
import {
  NoFx,
  Delay,
  Reverber,
  PitchShifter,
  useDelay,
  useReverb,
  usePitchShift,
} from "./Fx";

type Props = {
  track: SourceTrack;
  trackId: number;
  channels: Channel[];
};

function TrackChannel({ track, trackId, channels }: Props) {
  useAutomationData({ trackId, channels });
  const currentTracks = localStorageGet("currentTracks");
  // const ct = currentTracks[trackId];
  // const options = {
  //   wet: ct.delaySettings.delayMix[0],
  //   delayTime: ct.delaySettings.delayTime[0],
  //   feedback: ct.delaySettings.delayFeedback[0],
  // };
  const nofx = null;
  const delay = useDelay();
  const reverb = useReverb();
  const pitchShift = usePitchShift();
  const [, dispatch] = MixerMachineContext.useActor();
  const { send } = MixerMachineContext.useActorRef();

  // const trackFxNames = MixerMachineContext.useSelector(
  //   (state) => state.context.currentTracks[trackId].fxNames
  // );

  const disabled = currentTracks[trackId].fxNames.every((item: string) => {
    console.log("fxNames", currentTracks[trackId].fxNames);
    console.log("item", item);
    return item === "nofx";
  });
  console.log("disabled", disabled);

  function handleClick() {
    dispatch({
      type: "SET_ACTIVE_TRACK_PANELS",
      trackId,
    });
  }

  function saveTrackFx(e: React.FormEvent<HTMLSelectElement>) {
    const fxName = e.currentTarget.value;
    const id = e.currentTarget.id.at(-1);
    const fxId = (id && parseInt(id, 10)) || 0;

    switch (fxName) {
      case "nofx":
        channels[trackId].disconnect();
        channels[trackId].toDestination();
        break;

      case "reverb":
        channels[trackId].disconnect();
        reverb && channels[trackId].connect(reverb).toDestination();
        break;

      case "delay":
        channels[trackId].disconnect();
        delay && channels[trackId].connect(delay).toDestination();
        break;

      case "pitchShift":
        channels[trackId].disconnect();
        pitchShift && channels[trackId].connect(pitchShift).toDestination();
        break;

      default:
        break;
    }

    // const currentTracks = localStorageGet("currentTracks");
    // currentTracks[trackId].fxNames[fxId] = fxName;
    send({
      type: "SET_TRACK_FX_NAMES",
      trackId,
      fxId,
      value: fxName,
    });

    // localStorageSet("currentTracks", currentTracks);
  }

  console.log("currentTracks[trackId].fxNames", currentTracks[trackId].fxNames);
  const showNofx = currentTracks[trackId].fxNames.some(
    (name: string) => name === "nofx"
  );
  const showReverb = currentTracks[trackId].fxNames.some(
    (name: string) => name === "reverb"
  );
  const showDelay = currentTracks[trackId].fxNames.some(
    (name: string) => name === "delay"
  );
  const showPitchShift = currentTracks[trackId].fxNames.some(
    (name: string) => name === "pitchShift"
  );

  return (
    <div className="flex-y gap2">
      {/* <TrackFxSelect trackId={trackId} channels={channels} /> */}

      <>
        {currentTracks[trackId].panelActive === false && (
          <TrackPanel trackId={trackId}>
            {showNofx ? <NoFx nofx={nofx} /> : null}
            {showDelay ? (
              <Delay delay={delay} trackId={trackId} fxId={0} />
            ) : null}
            {showReverb ? (
              <Reverber reverb={reverb} trackId={trackId} fxId={0} />
            ) : null}
            {showPitchShift ? (
              <PitchShifter
                pitchShift={pitchShift}
                trackId={trackId}
                fxId={0}
              />
            ) : null}
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
        {array(2).map((_: void, fxId: number) => (
          <select
            key={fxId}
            id={`track${trackId}fx${fxId}`}
            className="fx-select"
            onChange={saveTrackFx}
            value={currentTracks[trackId].fxNames[fxId]}
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
