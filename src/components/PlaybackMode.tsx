import { MixerMachineContext } from "@/context/MixerMachineContext";
import CheckBox from "./CheckBox";
import Button from "./Buttons/Button";
import {
  XCircle,
  PlayCircle,
  CircleDotDashed,
  CircleDot,
  MinusCircle,
} from "lucide-react";
import { db } from "@/db";

type Props = {
  trackId: number;
  param: string;
};

function PlaybackMode({ trackId, param }: Props) {
  const { send } = MixerMachineContext.useActorRef();
  const playbackMode = MixerMachineContext.useSelector(
    (state) => state.context.currentTracks[trackId][`${param}Mode`]
  );

  function setPlaybackMode(e: React.FormEvent<HTMLInputElement>): void {
    send({
      type: "SET_PLAYBACK_MODE",
      checked: e.currentTarget.checked,
      value: e.currentTarget.value,
      param,
      trackId,
    });
  }

  function clearData() {
    db[`${param}Data`].where("id").equals(`${param}Data${trackId}`).delete();
  }

  return (
    <div className="flex gap4">
      {/* {playbackMode} */}
      <CheckBox
        type="radio"
        id={`track${trackId + 1}-${param}-write`}
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
        id={`track${trackId + 1}-${param}-read`}
        name={`track${trackId + 1}-${param}playbackMode`}
        onChange={setPlaybackMode}
        checked={playbackMode === "read"}
        value="read"
      >
        <PlayCircle />
      </CheckBox>
      <CheckBox
        type="radio"
        id={`track${trackId + 1}-${param}-static`}
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
