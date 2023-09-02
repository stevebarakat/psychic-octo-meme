import { useEffect, useState } from "react";
import { Destination, Volume } from "tone";
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
  const { send } = MixerMachineContext.useActorRef();

  const trackFxNames = MixerMachineContext.useSelector(
    (state) => state.context.currentTracks[trackId].fxNames
  );
  const [currentTrackFx, setCurrentTrackFx] = useState(
    Array(trackFxNames.length).fill(new Volume())
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

  useEffect(() => {
    trackFxNames.forEach((name, fxId) => {
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
    channels[trackId].connect(Destination);
    currentTrackFx.forEach((ctf) => {
      ctf && channels[trackId].chain(ctf, Destination);
    });
  });

  const showNofx = trackFxNames.some((name: string) => name === "nofx");
  const showReverb = trackFxNames.some((name: string) => name === "reverb");
  const showDelay = trackFxNames.some((name: string) => name === "delay");
  const showPitchShift = trackFxNames.some(
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

  const ubu = () => {
    if (!showDelay && !showPitchShift && !showReverb) return;
    return (
      <TrackPanel trackId={trackId}>
        {showNofx ? <NoFx nofx={nofx} /> : null}
        {showDelay ? (
          // <TrackPanel trackId={trackId}>
          <Delay delay={delay} trackId={trackId} fxId={0} />
        ) : // </TrackPanel>
        null}
        {showReverb ? (
          // <TrackPanel trackId={trackId}>
          <Reverber reverb={reverb} trackId={trackId} fxId={0} />
        ) : // </TrackPanel>
        null}
        {showPitchShift ? (
          // <TrackPanel trackId={trackId}>
          <PitchShifter pitchShift={pitchShift} trackId={trackId} fxId={0} />
        ) : // </TrackPanel>
        null}
      </TrackPanel>
    );
  };

  return (
    <div className="flex-y gap2">
      <>
        {ubu()}

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
        {array(trackFxNames.length + 1).map((_: void, fxId: number) => {
          console.log("trackFxNames[fxId]", trackFxNames[fxId]);
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
              value={trackFxNames[fxId]}
            >
              <option value={"nofx"}>
                {trackFxNames[fxId] === undefined ? "Add Fx" : "Remove Fx"}
              </option>
              <option value={"reverb"}>Reverb</option>
              <option value={"delay"}>Delay</option>
              <option value={"pitchShift"}>Pitch Shift</option>
            </select>
          );
        })}
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
