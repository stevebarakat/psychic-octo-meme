import { localStorageGet, localStorageSet } from "@/utils";
import { MixerMachineContext } from "@/context/MixerMachineContext";
import VuMeter from "../VuMeter";
import useMeter from "@/hooks/useMeter";

type Props = {
  trackId: number;
  channels: Channel[];
};

function Fader({ trackId, channels }: Props) {
  const meterVal = useMeter([channels[trackId]]);
  const { send } = MixerMachineContext.useActorRef();
  const { volume } = MixerMachineContext.useSelector(
    (state) => state.context.currentTracks[trackId]
  );

  function setVolume(e: React.FormEvent<HTMLInputElement>): void {
    send({
      type: "SET_TRACK_VOLUME",
      value: parseFloat(e.currentTarget.value),
      channels,
      trackId,
    });
  }

  function saveVolume(e: React.FormEvent<HTMLInputElement>): void {
    const currentTracks = localStorageGet("currentTracks");
    const value = parseFloat(e.currentTarget.value);
    currentTracks[trackId].volume = value;
    localStorageSet("currentTracks", currentTracks);
  }

  // console.log("volume", volume);
  return (
    <div className="fader-wrap">
      {/* <div className="window">{`${volume.toFixed(0)} dB`}</div> */}
      <div className="levels-wrap">
        <VuMeter meterValue={meterVal} height={150} width={12} />
      </div>
      <div className="vol-wrap">
        <input
          type="range"
          id={`trackVol${trackId}`}
          className="range-y volume"
          min={-100}
          max={12}
          step={0.1}
          value={volume}
          onPointerUp={saveVolume}
          onChange={setVolume}
        />
      </div>
    </div>
  );
}

export default Fader;
