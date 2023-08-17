import { MixerMachineContext } from "@/context/MixerMachineContext";
import CheckBox from "./CheckBox";

type Props = {
  busId: number;
  fxId: number;
  param: string;
};

function BusPlaybackMode({ busId, fxId, param }: Props) {
  // const [state] = MixerMachineContext.useActor();
  const { send } = MixerMachineContext.useActorRef();
  const playbackMode = MixerMachineContext.useSelector(
    (state) => state.context.currentBuses[busId][`${param}Mode`][fxId]
  );

  function setPlaybackMode(e: React.FormEvent<HTMLInputElement>): void {
    console.log("playback mode", playbackMode);
    send({
      type: "SET_BUS_PLAYBACK_MODE",
      checked: e.currentTarget.checked,
      value: e.currentTarget.value,
      param,
      busId,
      fxId,
    });
  }

  return (
    <div className="fx-mode-select">
      <CheckBox
        type="radio"
        id={`bus${busId + 1}-${param}-fx${fxId + 1}-write`}
        name={`${param}playbackMode`}
        onChange={setPlaybackMode}
        checked={playbackMode === "write"}
        value="write"
      >
        WRITE
      </CheckBox>
      <CheckBox
        type="radio"
        id={`bus${busId + 1}-${param}-fx${fxId + 1}-playback`}
        name={`${param}playbackMode`}
        onChange={setPlaybackMode}
        checked={playbackMode === "read"}
        value="read"
      >
        READ
      </CheckBox>
      <CheckBox
        type="radio"
        id={`bus${busId + 1}-${param}-fx${fxId + 1}-static`}
        name={`${param}playbackMode`}
        onChange={setPlaybackMode}
        checked={playbackMode === "static"}
        value="static"
      >
        STATIC
      </CheckBox>
    </div>
  );
}

export default BusPlaybackMode;
