import { MixerMachineContext } from "@/context/MixerMachineContext";
import Toggle from "./Buttons/Toggle";
import { Button } from "./Buttons";
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
  param: "volume" | "pan" | "soloMute";
};

function PlaybackMode({ trackId, param }: Props) {
  const { send } = MixerMachineContext.useActorRef();
  const playbackMode = MixerMachineContext.useSelector(
    (state) => state.context.currentTracks[trackId][`${param}Mode`]
  );
  const currentTracks = MixerMachineContext.useSelector(
    (state) => state.context.currentTracks
  );
  function setPlaybackMode(e: React.FormEvent<HTMLInputElement>): void {
    const ubu = JSON.parse(JSON.stringify(currentTracks));
    ubu[trackId][`${param}Mode`] = e.currentTarget.value;
    db.currentTracks.put({ id: "currentTracks", data: ubu });
    send({
      type: "SET_PLAYBACK_MODE",
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
      <Toggle
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
      </Toggle>
      <Toggle
        type="radio"
        id={`track${trackId + 1}-${param}-read`}
        name={`track${trackId + 1}-${param}playbackMode`}
        onChange={setPlaybackMode}
        checked={playbackMode === "read"}
        value="read"
      >
        <PlayCircle />
      </Toggle>
      <Toggle
        type="radio"
        id={`track${trackId + 1}-${param}-static`}
        name={`track${trackId + 1}-${param}playbackMode`}
        onChange={setPlaybackMode}
        checked={playbackMode === "static"}
        value="static"
      >
        <MinusCircle />
      </Toggle>
      <Button onClick={clearData}>
        <XCircle />
      </Button>
    </div>
  );
}

export default PlaybackMode;
