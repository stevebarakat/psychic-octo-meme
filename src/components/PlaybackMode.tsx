import { MixerMachineContext } from "@/context/MixerMachineContext";
import CheckBox from "./CheckBox";

type Props = {
  trackId: number;
  fxId: number;
  param: string;
};

function PlaybackMode({ trackId, fxId, param }: Props) {
  // const [state] = MixerMachineContext.useActor();
  const { send } = MixerMachineContext.useActorRef();
  const playbackMode = MixerMachineContext.useSelector(
    (state) => state.context.currentTracks[trackId][`${param}Mode`][fxId]
  );

  function setPlaybackMode(e: React.FormEvent<HTMLInputElement>): void {
    send({
      type: "SET_PLAYBACK_MODE",
      checked: e.currentTarget.checked,
      value: e.currentTarget.value,
      param,
      trackId,
      fxId,
    });
  }

  return (
    <div
      className={param === "volume" ? "track-mode-select" : "fx-mode-select"}
    >
      <CheckBox
        type="radio"
        id={`track${trackId + 1}-${param}-fx${fxId + 1}-write`}
        name={`track${trackId + 1}-${param}playbackMode`}
        onChange={setPlaybackMode}
        checked={playbackMode === "write"}
        value="write"
      >
        WR
      </CheckBox>
      <CheckBox
        type="radio"
        id={`track${trackId + 1}-${param}-fx${fxId + 1}-playback`}
        name={`track${trackId + 1}-${param}playbackMode`}
        onChange={setPlaybackMode}
        checked={playbackMode === "read"}
        value="read"
      >
        RD
      </CheckBox>
      <CheckBox
        type="radio"
        id={`track${trackId + 1}-${param}-fx${fxId + 1}-static`}
        name={`track${trackId + 1}-${param}playbackMode`}
        onChange={setPlaybackMode}
        checked={playbackMode === "static"}
        value="static"
      >
        BP
      </CheckBox>
    </div>
  );
}

export default PlaybackMode;
