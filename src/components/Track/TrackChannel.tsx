import { useState } from "react";
import TrackFxSelect from "./TrackFxSelect";
import {
  Destination,
  FeedbackDelay,
  Volume,
  PitchShift,
  Reverb,
  Gain,
} from "tone";
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
  useNoFx,
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
  // const currentTracks = localStorageGet("currentTracks");
  const currentTracks = MixerMachineContext.useSelector(
    (state) => state.context.currentTracks
  );
  const ct = currentTracks[trackId];
  // const options = {
  //   wet: ct.delaySettings.delayMix[0],
  //   delayTime: ct.delaySettings.delayTime[0],
  //   feedback: ct.delaySettings.delayFeedback[0],
  // };
  const nofx = useNoFx();
  const delay = useDelay();
  const reverb = useReverb();
  const pitchShift = usePitchShift();
  // const [, dispatch] = MixerMachineContext.useActor();
  const { send } = MixerMachineContext.useActorRef();
  const [currentTrackFx, setCurrentTrackFx] = useState<
    (Volume | Reverb | FeedbackDelay | PitchShift)[]
  >([new Volume(), new Volume()]);
  console.log("currentTrackFx", currentTrackFx);

  const trackFxNames = MixerMachineContext.useSelector(
    (state) => state.context.currentTracks[trackId].fxNames
  );

  const disabled = trackFxNames.every((item: string) => {
    return item === "nofx";
  });

  function handleClick() {
    send({
      type: "SET_ACTIVE_TRACK_PANELS",
      trackId,
    });
  }

  function saveTrackFx(e: React.FormEvent<HTMLSelectElement>) {
    const fxName = e.currentTarget.value;
    const id = e.currentTarget.id.at(-1);
    const fxId = parseInt(id!, 10);

    console.log("fxId", fxId);
    console.log("fxName", fxName);

    switch (fxName) {
      case "nofx":
        currentTrackFx[fxId] = nofx;
        setCurrentTrackFx(currentTrackFx);
        break;

      case "reverb":
        currentTrackFx[fxId] = reverb;
        setCurrentTrackFx(currentTrackFx);
        break;

      case "delay":
        currentTrackFx[fxId] = delay;
        setCurrentTrackFx(currentTrackFx);
        break;

      case "pitchShift":
        currentTrackFx[fxId] = pitchShift;
        setCurrentTrackFx(currentTrackFx);
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
    // currentTrackFx[0] &&
    //   channels[trackId].chain(currentTrackFx[0], Destination);
    // currentTrackFx[1] &&
    //   channels[trackId].chain(currentTrackFx[1], Destination);

    channels[trackId].disconnect();
    channels[trackId]
      .chain(currentTrackFx[0], currentTrackFx[1], Destination)
      .toDestination();
  }

  // console.log("trackFxNames", trackFxNames);
  const showNofx = trackFxNames.some((name: string) => name === "nofx");
  const showReverb = trackFxNames.some((name: string) => name === "reverb");
  const showDelay = trackFxNames.some((name: string) => name === "delay");
  const showPitchShift = trackFxNames.some(
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
