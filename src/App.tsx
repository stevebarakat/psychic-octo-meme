import { useState } from "react";
import { Mixer } from "./components/Mixer";
import { MixerMachineContext } from "@/context/MixerMachineContext";
import { db } from "./db";
import "dexie-export-import";
import { localStorageGet, localStorageSet } from "./utils";
import { setSourceSong } from "./utils/init";

function App() {
  const [mixName, setMixName] = useState("");
  const mixNames = Object.keys(window.localStorage);

  setSourceSong();

  async function importDb(
    e: React.FormEvent<HTMLSelectElement>
  ): Promise<void> {
    const data = localStorageGet(e.currentTarget.value);
    await db
      .import(data, { clearTablesBeforeImport: true })
      .then(() => window.location.reload());
  }

  async function exportDb(
    e: React.FormEvent<HTMLFormElement>,
    mixName: string
  ) {
    e.preventDefault();
    try {
      const blob = await db.export();
      const text = await blob.text();
      const parsed = JSON.parse(text);
      localStorageSet(mixName, parsed);
    } catch (error) {
      console.error("" + error);
    }
    setMixName("");
  }

  return (
    <MixerMachineContext.Provider>
      <form onSubmit={(e) => exportDb(e, mixName)}>
        <label htmlFor="mixName">File Name: </label>
        <input
          id="mixName"
          onChange={(e) => setMixName(e.currentTarget.value)}
          value={mixName}
        />
        <button>Submit</button>
      </form>
      <select name="mixes" id="mix-select" onChange={importDb}>
        <option value="">Choose a song:</option>
        {mixNames.map((mixName, i) => (
          <option key={i} value={mixName}>
            {mixName}
          </option>
        ))}
      </select>
      <Mixer />
    </MixerMachineContext.Provider>
  );
}

export default App;
