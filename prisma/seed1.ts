import type { Song } from "@prisma/client";
import { PrismaClient } from "@prisma/client";
const db = new PrismaClient();

export type { Song } from "@prisma/client";

export async function getSongWithTracks(id: Song["id"]) {
  return db.song.findUnique({ where: { id }, include: { tracks: true } });
}
// prisma/seed.ts
export async function seed1() {
  const song = await db.song.create({
    data: {
      title: "Roxanne",
      slug: "roxanne",
      artist: "The Police",
      year: "1978",
      studio: "Surry Sound",
      location: "Leatherhead, Surrey, U.K.",
      bpm: 92,
      start: 0,
      end: 180,
    },
  });

  await db.track.create({
    data: {
      songId: song.id,
      position: 1,
      name: "Drums",
      path: "https://ioxpcmpvgermtfqxwykx.supabase.co/storage/v1/object/public/songs/roxanne/Roxanne_Drums.mp3",
    },
  });
  await db.track.create({
    data: {
      songId: song.id,
      position: 2,
      name: "Bass",
      path: "https://ioxpcmpvgermtfqxwykx.supabase.co/storage/v1/object/public/songs/roxanne/Roxanne_Bass.mp3",
    },
  });
  await db.track.create({
    data: {
      songId: song.id,
      position: 3,
      name: "Guitar",
      path: "https://ioxpcmpvgermtfqxwykx.supabase.co/storage/v1/object/public/songs/roxanne/Roxanne_Guitar.mp3",
    },
  });
  await db.track.create({
    data: {
      songId: song.id,
      position: 4,
      name: "Vocals",
      path: "https://ioxpcmpvgermtfqxwykx.supabase.co/storage/v1/object/public/songs/roxanne/Roxanne_Vocal.mp3",
    },
  });
}
