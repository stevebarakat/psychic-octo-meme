import VuMeter from "../VuMeter";
import useMeter from "@/components/Main/useMeter";
import ChannelLabel from "../ChannelLabel";
import { MixerMachineContext } from "@/context/MixerMachineContext";

export default function Main() {
  const meterVal = useMeter();
  const { send } = MixerMachineContext.useActorRef();
  const { volume } = MixerMachineContext.useSelector(
    (state) => state.context.currentMain
  );

  function setVolume(e: React.FormEvent<HTMLInputElement>): void {
    send({
      type: "SET_MAIN_VOLUME",
      value: parseFloat(e.currentTarget.value),
    });
  }

  return (
    <div className="channel">
      <div className="flex-y center fader-wrap">
        <div className="window">{`${volume.toFixed(0)} dB`}</div>
        <div className="levels-wrap">
          <VuMeter meterValue={meterVal} height={350} width={25} />
        </div>
        <div className="vol-wrap">
          <input
            type="range"
            className="range-y volume main"
            id="main"
            min={-100}
            max={0}
            step={0.1}
            value={volume}
            onChange={setVolume}
          />
        </div>
        <ChannelLabel channelName="Main" />
      </div>
    </div>
  );
}
