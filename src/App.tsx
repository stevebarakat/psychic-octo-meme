import { useState } from "react";
import { Mixer } from "./components/Mixer";
import { MixerMachineContext } from "@/context/MixerMachineContext";
import { db } from "./db";
import download from "downloadjs";
import "dexie-export-import";
import { localStorageSet } from "./utils";

type ProgressProps = {
  totalRows: number;
  completedRows: number;
};

function progressCallback({ totalRows, completedRows }: ProgressProps) {
  console.log(`Progress: ${completedRows} of ${totalRows} rows completed`);
}

async function importDb(e: React.FormEvent<HTMLInputElement>): Promise<void> {
  const file: Blob | null = e.currentTarget.files && e.currentTarget.files[0];
  if (file === null) return;
  db.currentTracks.where("id").equals("currentTracks").delete();
  db.sourceSong.where("id").equals("sourceSong").delete();
  db.volumeData.where("id").equals("volumeData").delete();
  db.panData.where("id").equals("panData").delete();
  db.soloMuteData.where("id").equals("soloMuteData").delete();
  db.delayData.where("id").equals("delayData").delete();
  db.reverbData.where("id").equals("reverbData").delete();
  db.pitchShiftData.where("id").equals("pitchShiftData").delete();
  await db.import(file).then(() => window.location.reload());
}

function App() {
  const [fileName, setFileName] = useState("");

  async function exportDb(e) {
    e.preventDefault();
    try {
      const blob = await db.export({ prettyJson: true, progressCallback });
      // download(blob, `${fileName}.json`, "text/json");
      const text = await blob.text();
      const parsed = JSON.parse(text);
      localStorageSet("blob", parsed);
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
      <Mixer />
    </MixerMachineContext.Provider>
  );
}

export default App;
