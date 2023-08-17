import { useState } from "react";
import { Mixer } from "./components/Mixer";
import { roxanne } from "./assets/songs";
import { localStorageGet, localStorageSet } from "./utils";
import { MixerMachineContext } from "@/context/MixerMachineContext";
import { defaultTrackData, defaultBusData } from "./assets/songs/defaultData";
import { db } from "./db";
import download from "downloadjs";
import "dexie-export-import";

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

const getCurrentBuses = () => {
  let defaultCurrentBuses;
  const currentBuses = localStorageGet("currentBuses");
  if (!currentBuses) localStorageSet("currentBuses", defaultBusData);
  return defaultCurrentBuses;
};

getCurrentMain();
getCurrentTracks();
getCurrentBuses();

function progressCallback({ totalRows, completedRows }) {
  console.log(`Progress: ${completedRows} of ${totalRows} rows completed`);
}

async function importDb(e) {
  console.log("e", e);
  const file = e.target.files[0];
  console.log("file", file);
  db.import(file);
}

function App() {
  const [fileName, setFileName] = useState("");

  async function exportDb(e, fileName) {
    e.preventDefault();
    try {
      const blob = await db.export({ prettyJson: true, progressCallback });
      download(blob, `${fileName}.json`, "text/json");
    } catch (error) {
      console.error("" + error);
    }
    setFileName("");
  }

  return (
    <MixerMachineContext.Provider>
      <form onSubmit={(e) => exportDb(e, fileName)}>
        <label htmlFor="fileName">File Name: </label>
        <input
          id="fileName"
          onChange={(e) => setFileName(e.currentTarget.value)}
          value={fileName}
        />
        <button>Submit</button>
      </form>
      <input
        type="file"
        id="mix"
        name="mix"
        accept="text/json"
        onInput={importDb}
      />
      <Mixer sourceSong={sourceSong} />
    </MixerMachineContext.Provider>
  );
}

export default App;
