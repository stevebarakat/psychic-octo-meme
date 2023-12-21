import { MixerMachineContext } from "@/context/MixerMachineContext";

type Props = {
  trackId: number;
  param: "volume" | "pan" | "soloMute";
};

function PlaybackMode({ trackId, param }: Props) {
  const { send } = MixerMachineContext.useActorRef();
  const { currentTracks } = MixerMachineContext.useSelector(
    (state) => state.context
  );
  const playbackMode = currentTracks[trackId][`${param}Mode`];

  function setPlaybackMode(e: React.FormEvent<HTMLSelectElement>): void {
    send({
      type: "SET_PLAYBACK_MODE",
      value: e.currentTarget.value,
      param,
      trackId,
    });
  }

  return (
    <div className="flex gap4 center">
      {/* {playbackMode} */}
      <select
        style={{ textAlign: "center" }}
        name="playbackMode"
        id={`${param}Mode-select-${trackId}`}
        onChange={setPlaybackMode}
        value={playbackMode}
      >
        <option value="off">off</option>
        <option value="read">read</option>
        <option value="write">write</option>
      </select>
    </div>
  );
}

export default PlaybackMode;
