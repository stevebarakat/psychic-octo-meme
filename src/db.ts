import Dexie, { Table } from "dexie";
import { roxanne } from "./assets/songs";
import { defaultTrackData } from "./assets/songs/defaultData";

type VolumeData = {
  id?: string;
  data: Map<number, { id: number; value: TrackSettings; time: number }>;
};

type PanData = {
  id?: string;
  data: Map<number, { id: number; value: TrackSettings; time: number }>;
};

type SoloMuteData = {
  id?: string;
  data: Map<
    number,
    { id: number; value: { solo: boolean; mute: boolean }; time: number }
  >;
};

type DelayData = {
  id?: string;
  data: Map<number, { id: number; value: DelaySettings; time: number }>;
};

type ReverbData = {
  id?: string;
  data: Map<number, { id: number; value: ReverbSettings; time: number }>;
};

type PitchShiftData = {
  id?: string;
  data: Map<number, { id: number; value: PitchShiftSettings; time: number }>;
};

export class DexieDb extends Dexie {
  sourceSong!: Table<SourceSong>;
  currentTracks!: Table<TrackSettings>;
  volumeData!: Table<VolumeData>;
  panData!: Table<PanData>;
  soloMuteData!: Table<SoloMuteData>;
  delayData!: Table<DelayData>;
  reverbData!: Table<ReverbData>;
  pitchShiftData!: Table<PitchShiftData>;

  constructor() {
    super("mixerDb");
    this.version(1).stores({
      sourceSong: "++id",
      currentTracks: "++id",
      volumeData: "++id",
      panData: "++id",
      soloMuteData: "++id",
      delayData: "++id",
      reverbData: "++id",
      pitchShiftData: "++id",
    });
  }
}

export const db = new DexieDb();

// const dbStores = db._storeNames;

// Populate with data:
db.on("ready", function (db) {
  db.sourceSong.count(function (count) {
    if (count > 0) {
      return console.log(`Already populated`);
    } else {
      console.log("Database is empty. Populating with default data...");

      const data = [{ id: "sourceSong", data: roxanne }];

      return db.sourceSong.bulkAdd(data);
    }
  });
});

// Populate with data:
db.on("ready", function (db) {
  db.currentTracks.count(function (count) {
    if (count > 0) {
      return console.log(`Already populated`);
    } else {
      console.log("Database is empty. Populating with default data...");

      const data = [
        {
          id: "currentTracks",
          data: roxanne.tracks.map((track: TrackSettings) => ({
            id: crypto.randomUUID(),
            name: track.name,
            path: track.path,
            ...defaultTrackData,
          })),
        },
      ];

      return db.currentTracks.bulkAdd(data);
    }
  });
});

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
