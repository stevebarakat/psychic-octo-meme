import Dexie, { Table } from "dexie";

type VolumeData = {
  id?: string;
  data: [];
};

export class DexieDb extends Dexie {
  volumeData!: Table<VolumeData>;

  constructor() {
    super("mixerDb");
    this.version(1).stores({
      volumeData: "++id",
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
