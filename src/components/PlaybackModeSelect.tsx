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
  function setPlaybackMode(e: React.FormEvent<HTMLSelectElement>): void {
    const ctCopy = JSON.parse(JSON.stringify(currentTracks));
    ctCopy[trackId][`${param}Mode`] = e.currentTarget.value;
    db.currentTracks.put({ id: "currentTracks", data: ctCopy });
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
      <select
        name="playbackMode"
        id="playbackMode-select"
        onChange={setPlaybackMode}
      >
        <option value="static">Static</option>
        <option value="read">Read</option>
        <option value="write">Write</option>
      </select>
      <Button onClick={clearData}>
        <XCircle />
      </Button>
    </div>
  );
}

export default PlaybackMode;
