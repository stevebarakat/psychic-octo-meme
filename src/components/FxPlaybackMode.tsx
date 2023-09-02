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
import { DexieDb, db } from "@/db";

type Props = {
  trackId: number;
  fxId: number;
  param: "delay" | "reverb" | "pitchShift";
};

function PlaybackMode({ trackId, fxId, param }: Props) {
  const { send } = MixerMachineContext.useActorRef();
  const playbackMode = MixerMachineContext.useSelector(
    (state) =>
      state.context.currentTracks[trackId][
        `${param}Settings` as keyof TrackSettings
      ].playbackMode
  );

  console.log("playbackMode", playbackMode);

  function setPlaybackMode(e: React.FormEvent<HTMLInputElement>): void {
    send({
      type: "SET_FX_PLAYBACK_MODE",
      checked: e.currentTarget.checked,
      value: e.currentTarget.value,
      param,
      trackId,
    });
  }

  function clearData() {
    db[`${param}Data` as keyof DexieDb]
      .where("id")
      .equals(`${param}Data${trackId}`)
      .delete();
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
