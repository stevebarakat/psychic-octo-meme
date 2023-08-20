import { Mixer } from "./components/Mixer";
import { roxanne } from "./assets/songs";
import { localStorageGet, localStorageSet } from "./utils";
import { MixerMachineContext } from "@/context/MixerMachineContext";
import { defaultTrackData } from "./assets/songs/defaultData";

const sourceSong = localStorageGet("sourceSong") || roxanne;

const getCurrentMain = () => {
  const currentMain = localStorageGet("currentMain");
  if (!currentMain) {
    localStorageSet("currentMain", {
      volume: -32,
    });
  }
  return currentMain;
};

const getCurrentTracks = () => {
  const currentTracks = localStorageGet("currentTracks");
  if (!currentTracks) {
    const defaultCurrentTracks = sourceSong.tracks.map(
      (track: SourceTrack) => ({
        id: track.id,
        name: track.name,
        path: track.path,
        ...defaultTrackData,
      })
    );
    localStorageSet("currentTracks", defaultCurrentTracks);
    return defaultCurrentTracks;
  }
  return currentTracks;
};

getCurrentMain();
getCurrentTracks();

function App() {
  return (
    <MixerMachineContext.Provider>
      <Mixer sourceSong={sourceSong} />
    </MixerMachineContext.Provider>
  );
}

export default App;
