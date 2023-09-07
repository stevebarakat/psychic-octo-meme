import { useEffect, useState, useRef } from "react";
import { Destination, Meter, Volume } from "tone";
import PlaybackMode from "../PlaybackMode";
import Pan from "./Pan";
import SoloMute from "./SoloMute";
import Fader from "./Fader";
import ChannelLabel from "../ChannelLabel";
import useTrackAutomationData from "@/hooks/useTrackAutomationData";
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
  useTrackAutomationData({ trackId, channels });
  const currentTracks = MixerMachineContext.useSelector(
    (state) => state.context.currentTracks
  );
  const fxNames = MixerMachineContext.useSelector(
    (state) => state.context.currentTracks[trackId].fxNames
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

  const meters = useRef(Array(channels.length).fill(new Meter()));
  console.log("meters", meters);

  const { send } = MixerMachineContext.useActorRef();

  const [currentTrackFx, setCurrentTrackFx] = useState(
    Array(fxNames.length).fill(new Volume())
  );

  const disabled = fxNames.every((item: string) => {
    return item === "nofx";
  });

  function handleClick() {
    send({
      type: "SET_ACTIVE_TRACK_PANELS",
      trackId,
    });
  }
  useEffect(() => {
    currentTracks[trackId].fxNames.forEach((name, fxId) => {
      switch (name) {
        case "nofx":
          currentTrackFx[fxId] = nofx;
          setCurrentTrackFx(() => currentTrackFx);
          break;

        case "reverb":
          currentTrackFx[fxId] = reverb;
          setCurrentTrackFx(() => currentTrackFx);
          break;

        case "delay":
          currentTrackFx[fxId] = delay;
          setCurrentTrackFx(() => currentTrackFx);
          break;

        case "pitchShift":
          currentTrackFx[fxId] = pitchShift;
          setCurrentTrackFx(() => currentTrackFx);
          break;

        default:
          break;
      }
    }, []);

    channels[trackId].disconnect();
    channels[trackId].connect(meters.current[2].toDestination());
    currentTrackFx.forEach((ctf) => {
      ctf && channels[trackId].chain(ctf, Destination);
    });
  });

  const showReverb = currentTracks[trackId].fxNames.some(
    (name: string) => name === "reverb"
  );
  const showDelay = currentTracks[trackId].fxNames.some(
    (name: string) => name === "delay"
  );
  const showPitchShift = currentTracks[trackId].fxNames.some(
    (name: string) => name === "pitchShift"
  );

  function setTrackFxNames(
    e: React.FormEvent<HTMLSelectElement>,
    action: string
  ) {
    const fxName = e.currentTarget.value;
    const id = e.currentTarget.id.at(-1);
    const fxId = parseInt(id!, 10);

    currentTrackFx.splice(fxId, 1);

    send({
      type: "SET_TRACK_FX_NAMES",
      trackId,
      fxId,
      action,
      channels,
      value: fxName,
    });
  }

  const getPanel = () => {
    if (!showDelay && !showPitchShift && !showReverb) return;
    return (
      <TrackPanel trackId={trackId}>
        {showDelay && <Delay delay={delay} trackId={trackId} fxId={0} />}
        {showReverb && <Reverber reverb={reverb} trackId={trackId} fxId={0} />}
        {showPitchShift && (
          <PitchShifter pitchShift={pitchShift} trackId={trackId} fxId={0} />
        )}
      </TrackPanel>
    );
  };

  return (
    <div className="flex-y gap2">
      <>
        {getPanel()}
        <ChannelButton
          className="fx-select"
          disabled={disabled}
          onClick={handleClick}
        >
          {disabled
            ? "No "
            : currentTracks[trackId].panelActive === false
            ? "Close "
            : "Open "}
          FX
        </ChannelButton>
        {array(currentTracks[trackId].fxNames.length + 1).map(
          (_: void, fxId: number) => {
            console.log(
              "currentTracks[trackId].fxNames[fxId]",
              currentTracks[trackId].fxNames[fxId]
            );
            return (
              <select
                key={fxId}
                id={`track${trackId}fx${fxId}`}
                className="fx-select"
                onChange={(e) =>
                  e.target.value !== "nofx"
                    ? setTrackFxNames(e, "add")
                    : setTrackFxNames(e, "remove")
                }
                value={currentTracks[trackId].fxNames[fxId]}
              >
                <option value={"nofx"}>
                  {currentTracks[trackId].fxNames[fxId] === undefined
                    ? "Add Fx"
                    : "Remove Fx"}
                </option>
                <option value={"reverb"}>Reverb</option>
                <option value={"delay"}>Delay</option>
                <option value={"pitchShift"}>Pitch Shift</option>
              </select>
            );
          }
        )}
      </>

      <div className="channel">
        <Pan trackId={trackId} channels={channels} />
        <Fader trackId={trackId} channels={channels} meters={meters} />
        <SoloMute trackId={trackId} channels={channels} />
        <ChannelLabel channelName={track.name} />
      </div>
      <PlaybackMode trackId={trackId} param="volume" />
    </div>
  );
}

export default TrackChannel;
