import { useEffect, useState, useRef } from "react";
import { Destination, Meter, Volume } from "tone";
import PlaybackMode from "../PlaybackMode";
import Pan from "./Pan";
import SoloMute from "./SoloMute";
import Fader from "./Fader";
import ChannelLabel from "../ChannelLabel";
import { upperFirst } from "lodash";
import useVolumeAutomationData from "@/hooks/useVolumeAutomationData";
import { ChannelButton } from "../Buttons";
import { array } from "@/utils";
import { MixerMachineContext } from "@/context/MixerMachineContext";
import TrackPanel from "./TrackPanel";
import {
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
  useVolumeAutomationData({ trackId, channels });
  const currentTracks = MixerMachineContext.useSelector(
    (state) => state.context.currentTracks
  );
  const fxNames = MixerMachineContext.useSelector(
    (state) => state.context.currentTracks[trackId].fxNames
  );

  const nofx = useNoFx();
  const delay = useDelay();
  const reverb = useReverb();
  const pitchShift = usePitchShift();

  const meters = useRef(
    Array(channels.length).fill(new Meter({ channels: 2 }))
  );

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
    fxNames.forEach((name, fxId) => {
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
    channels[trackId].connect(meters.current[trackId].toDestination());
    currentTrackFx.forEach((ctf) => {
      ctf && channels[trackId].chain(ctf, Destination);
    });
  });

  const showReverb = fxNames.some((name: string) => name === "reverb");
  const showDelay = fxNames.some((name: string) => name === "delay");
  const showPitchShift = fxNames.some((name: string) => name === "pitchShift");

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
        {array(fxNames.length + 1).map((_: void, fxId: number) => {
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
              value={fxNames[fxId]}
            >
              <option value={"nofx"}>
                {fxNames[fxId] === undefined
                  ? "Add Fx"
                  : `- ${upperFirst(fxNames[fxId])}`}
              </option>
              <option value={"reverb"} disabled={showReverb}>
                Reverb
              </option>
              <option value={"delay"} disabled={showDelay}>
                Delay
              </option>
              <option value={"pitchShift"} disabled={showPitchShift}>
                Pitch Shift
              </option>
            </select>
          );
        })}
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
