import { useState } from "react";
import { Mixer } from "./components/Mixer";
import { MixerMachineContext } from "@/context/MixerMachineContext";
import { db } from "./db";
import download from "downloadjs";
import "dexie-export-import";
import { localStorageGet, localStorageSet } from "./utils";

function App() {
  const [mixName, setMixName] = useState("");
  const mixNames = Object.keys(window.localStorage);

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
      const blob = await db.export({ prettyJson: true });
      // download(blob, `${mixName}.json`, "text/json");
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
