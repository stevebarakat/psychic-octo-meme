import { localStorageGet, localStorageSet } from "@/utils";
import { MixerMachineContext } from "@/context/MixerMachineContext";
import VuMeter from "../VuMeter";
import useBusMeter from "./hooks/useBusMeter";
import { Meter } from "tone";

type Props = {
  busId: number;
  channels: BusChannel[];
  meters: React.MutableRefObject<Meter[]>;
};

function Fader({ busId, channels, meters }: Props) {
  const { send } = MixerMachineContext.useActorRef();
  const { volume } = MixerMachineContext.useSelector(
    (state) => state.context.currentBuses[busId]
  );

  const meterVal = useBusMeter([channels[busId]], meters);

  function setVolume(e: React.FormEvent<HTMLInputElement>): void {
    send({
      type: "SET_BUS_VOLUME",
      value: parseFloat(e.currentTarget.value),
      channels,
      busId,
    });
  }

  function saveVolume(e: React.FormEvent<HTMLInputElement>): void {
    const currentBuses = localStorageGet("currentBuses");
    const value = parseFloat(e.currentTarget.value);
    currentBuses[busId].volume = value;
    localStorageSet("currentBuses", currentBuses);
  }

  return (
    <div className="fader-wrap">
      <div className="window">{`${volume.toFixed(0)} dB`}</div>
      <div className="levels-wrap">
        <VuMeter meterValue={meterVal} height={250} width={18} />
      </div>
      <div className="vol-wrap">
        <input
          type="range"
          id={`trackVol${busId}`}
          className="range-y volume bus"
          min={-100}
          max={0}
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
