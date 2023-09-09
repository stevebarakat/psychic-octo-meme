import { roxanne } from "@/assets/songs";
import { defaultTrackData } from "@/assets/songs/defaultData";
import { db } from "@/db";

export async function setSourceSong() {
  const sourceSong = await db.sourceSong
    .where("id")
    .equals("sourceSong")
    .toArray();
  if (!sourceSong) {
    db.sourceSong.add({
      ...roxanne,
    });
    setCurrentTracks();
    window.location.reload();
  }
}

async function setCurrentTracks() {
  const currentTracks = await db.currentTracks
    .where("id")
    .equals("currentTracks")
    .toArray();

  if (!currentTracks) {
    roxanne.tracks.map((track: SourceTrack) =>
      db.currentTracks.add({
        id: track.id,
        name: track.name,
        path: track.path,
        ...defaultTrackData,
      })
    );
  }
}
