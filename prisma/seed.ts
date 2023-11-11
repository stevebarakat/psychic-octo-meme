import { PrismaClient } from "@prisma/client";
import { seed1 } from "./seed1";
import { seed2 } from "./seed2";
import { seed3 } from "./seed3";
// import { seed5 } from "./seed5";
// import { seed6 } from "./seed6";
// import { seed7 } from "./seed7";
// import { seed8 } from "./seed8";
// import { seed9 } from "./seed9";
// import { seed10 } from "./seed10";
// import { seed11 } from "./seed11";
// import { seed12 } from "./seed12";
// import { seed13 } from "./seed13";

const db = new PrismaClient();

seed1()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });

seed2()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });

seed3()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });

// seed4()
//   .catch((e) => {
//     console.error(e);
//     process.exit(1);
//   })
//   .finally(async () => {
//     await db.$disconnect();
//   });

// seed5()
//   .catch((e) => {
//     console.error(e);
//     process.exit(1);
//   })
//   .finally(async () => {
//     await db.$disconnect();
//   });

// seed6()
//   .catch((e) => {
//     console.error(e);
//     process.exit(1);
//   })
//   .finally(async () => {
//     await db.$disconnect();
//   });

// seed7()
//   .catch((e) => {
//     console.error(e);
//     process.exit(1);
//   })
//   .finally(async () => {
//     await db.$disconnect();
//   });

// seed8()
//   .catch((e) => {
//     console.error(e);
//     process.exit(1);
//   })
//   .finally(async () => {
//     await db.$disconnect();
//   });

// seed9()
//   .catch((e) => {
//     console.error(e);
//     process.exit(1);
//   })
//   .finally(async () => {
//     await db.$disconnect();
//   });

// seed10()
//   .catch((e) => {
//     console.error(e);
//     process.exit(1);
//   })
//   .finally(async () => {
//     await db.$disconnect();
//   });

// seed11()
//   .catch((e) => {
//     console.error(e);
//     process.exit(1);
//   })
//   .finally(async () => {
//     await db.$disconnect();
//   });

// seed12()
//   .catch((e) => {
//     console.error(e);
//     process.exit(1);
//   })
//   .finally(async () => {
//     await db.$disconnect();
//   });

// seed13()
//   .catch((e) => {
//     console.error(e);
//     process.exit(1);
//   })
//   .finally(async () => {
//     await db.$disconnect();
//   });
