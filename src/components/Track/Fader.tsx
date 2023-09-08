import { MixerMachineContext } from "@/context/MixerMachineContext";
import VuMeter from "../VuMeter";
import useMeters from "@/hooks/useMeters";
import { Meter } from "tone";

type Props = {
  trackId: number;
  channels: Channel[];
  meters: React.MutableRefObject<Meter[]>;
};

function Fader({ trackId, channels, meters }: Props) {
  const meterVal = useMeters([channels[trackId]], meters);
  const { send } = MixerMachineContext.useActorRef();
  const { volume } = MixerMachineContext.useSelector(
    (state) => state.context.currentTracks[trackId]
  );

  function setVolume(e: React.FormEvent<HTMLInputElement>): void {
    send({
      type: "SET_TRACK_VOLUME",
      value: parseFloat(e.currentTarget.value),
      trackId,
    });
  }

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
          onChange={setVolume}
        />
      </div>
    </div>
  );
}

export default Fader;
