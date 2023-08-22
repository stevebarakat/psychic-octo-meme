import { Mixer } from "./components/Mixer";
import { roxanne } from "./assets/songs";
import { localStorageGet, localStorageSet } from "./utils";
import { MixerMachineContext } from "@/context/MixerMachineContext";
import { defaultTrackData } from "./assets/songs/defaultData";

// const sourceSong = localStorageGet("sourceSong") || roxanne;

const getSourceSong = async () => {
  let sourceSong = await localStorageGet("sourceSong");
  if (!sourceSong) {
    sourceSong = roxanne;
    localStorageSet("sourceSong", roxanne);
    // window.location.reload();
  }
  return sourceSong;
};

const getCurrentMain = () => {
  const currentMain = localStorageGet("currentMain");
  if (!currentMain) {
    localStorageSet("currentMain", {
      volume: -32,
    });
  }
  return currentMain;
};

const getCurrentTracks = async () => {
  const sourceSong = (await localStorageGet("sourceSong")) || roxanne;
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

getSourceSong();
getCurrentMain();
getCurrentTracks();

function App() {
  return (
    <MixerMachineContext.Provider>
      <Mixer />
    </MixerMachineContext.Provider>
  );
}

export default App;
