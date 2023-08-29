import { MixerMachineContext } from "@/context/MixerMachineContext";
import { localStorageGet, localStorageSet } from "@/utils";

function useSaveTrackFx(trackId: number) {
  const { send } = MixerMachineContext.useActorRef();
  const trackFxNames = MixerMachineContext.useSelector(
    (state) => state.context.currentTracks[trackId].fxNames
  );
  function saveTrackFx(e: React.FormEvent<HTMLSelectElement>) {
    const currentTracks = localStorageGet("currentTracks");

    const sid = e.currentTarget.id.at(-1) ?? 0;
    const id = parseInt(sid.toString(), 10);
    trackFxNames[trackId] = e.currentTarget.value;
    send({
      type: "SET_TRACK_FX_NAMES",
      trackId,
      value: trackFxNames,
    });

    currentTracks[trackId].fxNames[id] = e.currentTarget.value;
    localStorageSet("currentTracks", currentTracks);
  }

  return saveTrackFx;
}

export default useSaveTrackFx;
