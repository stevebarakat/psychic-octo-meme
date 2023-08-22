import { Mixer } from "./components/Mixer";
import { roxanne } from "./assets/songs";
import { localStorageGet, localStorageSet } from "./utils";
import { MixerMachineContext } from "@/context/MixerMachineContext";
import { defaultTrackData } from "./assets/songs/defaultData";

function setSourceSong() {
  const sourceSong = localStorageGet("sourceSong");
  if (!sourceSong) {
    localStorageSet("sourceSong", roxanne);
    setCurrentMain();
    setCurrentTracks();
    window.location.reload();
  }
}

function setCurrentMain() {
  const currentMain = localStorageGet("currentMain");
  if (!currentMain) {
    localStorageSet("currentMain", {
      volume: -32,
    });
  }
}

function setCurrentTracks() {
  const sourceSong = localStorageGet("sourceSong") || roxanne;
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
  }
}

setSourceSong();

function App() {
  return (
    <MixerMachineContext.Provider>
      <Mixer />
    </MixerMachineContext.Provider>
  );
}

export default App;
