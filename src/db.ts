import Dexie, { Table } from "dexie";

type VolumeData = {
  id?: string;
  data: [];
};

type PanData = {
  id?: string;
  data: [];
};

type SoloData = {
  id?: string;
  data: [];
};

type MuteData = {
  id?: string;
  data: [];
};

type DelayData = {
  id?: string;
  data: [];
};

type ReverbData = {
  id?: string;
  data: [];
};

type PitchShiftData = {
  id?: string;
  data: [];
};

type BusDelayData = {
  id?: string;
  data: [];
};

type BusReverbData = {
  id?: string;
  data: [];
};

type BusPitchShiftData = {
  id?: string;
  data: [];
};

export class DexieDb extends Dexie {
  volumeData!: Table<VolumeData>;
  panData!: Table<PanData>;
  soloData!: Table<SoloData>;
  muteData!: Table<MuteData>;
  delayData!: Table<DelayData>;
  reverbData!: Table<ReverbData>;
  pitchShiftData!: Table<PitchShiftData>;
  busDelayData!: Table<BusDelayData>;
  busReverbData!: Table<BusReverbData>;
  busPitchShiftData!: Table<BusPitchShiftData>;

  constructor() {
    super("mixerDb");
    this.version(1).stores({
      volumeData: "++id",
      panData: "++id",
      soloData: "++id",
      muteData: "++id",
      delayData: "++id",
      reverbData: "++id",
      pitchShiftData: "++id",
      busDelayData: "++id",
      busReverbData: "++id",
      busPitchShiftData: "++id",
    });
  }
}

export const db = new DexieDb();

// const dbStores = db._storeNames;

// // Populate with data:
// db.on("ready", function (db) {
//   dbStores.forEach((storeName) => {
//     db[`${storeName}`].count(function (count) {
//       if (count > 0) {
//         return console.log(`Already populated`);
//       } else {
//         console.log("Database is empty. Populating with default data...");

//         const data = [{ id: `${storeName}`, data: [] }];

//         return db[`${storeName}`].bulkAdd(data);
//       }
//     });
//   });
// });

// // Queued until data finished populating:
// dbStores.forEach((storeName) => {
//   db[`${storeName}`]
//     .each(function (obj) {
//       // Log objects, limit to 100 characters.
//       console.log(`Found object: ${JSON.stringify(obj).substring(0, 100)}`);
//     })
//     .then(function () {
//       console.log("Finished.");
//     })
//     .catch(function (error) {
//       console.error(error.stack || error);
//     });
// });
