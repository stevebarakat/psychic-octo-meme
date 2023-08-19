import { MixerMachineContext } from "@/context/MixerMachineContext";
import CheckBox from "./CheckBox";
import Button from "./Buttons/Button";
import {
  XCircle,
  PlayCircle,
  CircleDotDashed,
  CircleDot,
  Circle,
  MinusCircle,
} from "lucide-react";
import { db } from "@/db";

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

  function clearData() {
    db[`${param}Data`].where("id").equals(`${param}Data${trackId}`).delete();
  }

  const isPanel =
    param === "volume" ||
    param === "pan" ||
    param === "solo" ||
    param === "mute";

  return (
    <div className={isPanel ? "track-mode-select" : "fx-mode-select"}>
      {playbackMode}
      <CheckBox
        type="radio"
        id={`track${trackId + 1}-${param}-fx${fxId + 1}-write`}
        name={`track${trackId + 1}-${param}playbackMode`}
        onChange={setPlaybackMode}
        checked={playbackMode === "write"}
        value="write"
      >
        {playbackMode === "write" ? (
          <CircleDotDashed className="rotate" />
        ) : (
          <CircleDot />
        )}
      </CheckBox>
      <CheckBox
        type="radio"
        id={`track${trackId + 1}-${param}-fx${fxId + 1}-playback`}
        name={`track${trackId + 1}-${param}playbackMode`}
        onChange={setPlaybackMode}
        checked={playbackMode === "read"}
        value="read"
      >
        <PlayCircle />
      </CheckBox>
      <CheckBox
        type="radio"
        id={`track${trackId + 1}-${param}-fx${fxId + 1}-static`}
        name={`track${trackId + 1}-${param}playbackMode`}
        onChange={setPlaybackMode}
        checked={playbackMode === "static"}
        value="static"
      >
        <MinusCircle />
      </CheckBox>
      <Button onClick={clearData}>
        <XCircle />
      </Button>
    </div>
  );
}

export default PlaybackMode;
