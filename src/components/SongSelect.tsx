import {
  justDance,
  roxanne,
  aDayInTheLife,
  blueMonday,
  ninteenOne,
} from "@/assets/songs";
import { localStorageSet } from "@/utils";
import { defaultTrackData, defaultBusData } from "@/assets/songs/defaultData";

function SongSelect() {
  function onChange(e: React.FormEvent<HTMLSelectElement>): void {
    switch (e.currentTarget.value) {
      case "ninteenOne": {
        window.location.reload();
        localStorageSet("sourceSong", ninteenOne);
        const currentTracks = ninteenOne.tracks.map((track) => ({
          id: crypto.randomUUID(),
          name: track.name,
          path: track.path,
          ...defaultTrackData,
        }));
        localStorageSet("currentTracks", currentTracks);
        localStorageSet("currentBuses", defaultBusData);
        break;
      }
      case "roxanne": {
        window.location.reload();
        localStorageSet("sourceSong", roxanne);
        const currentTracks = roxanne.tracks.map((track) => ({
          id: crypto.randomUUID(),
          name: track.name,
          path: track.path,
          ...defaultTrackData,
        }));
        localStorageSet("currentTracks", currentTracks);
        localStorageSet("currentBuses", defaultBusData);
        break;
      }
      case "aDayInTheLife": {
        window.location.reload();
        localStorageSet("sourceSong", aDayInTheLife);
        const currentTracks = aDayInTheLife.tracks.map((track) => ({
          id: crypto.randomUUID(),
          name: track.name,
          path: track.path,
          ...defaultTrackData,
        }));
        localStorageSet("currentTracks", currentTracks);
        localStorageSet("currentBuses", defaultBusData);
        break;
      }
      case "blueMonday": {
        window.location.reload();
        localStorageSet("sourceSong", blueMonday);
        const currentTracks = blueMonday.tracks.map((track) => ({
          id: crypto.randomUUID(),
          name: track.name,
          path: track.path,
          ...defaultTrackData,
        }));
        localStorageSet("currentTracks", currentTracks);
        localStorageSet("currentBuses", defaultBusData);
        break;
      }
      case "justDance": {
        window.location.reload();
        localStorageSet("sourceSong", justDance);
        const currentTracks = justDance.tracks.map((track) => ({
          id: crypto.randomUUID(),
          name: track.name,
          path: track.path,
          ...defaultTrackData,
        }));
        localStorageSet("currentTracks", currentTracks);
        localStorageSet("currentBuses", defaultBusData);
        break;
      }

      default:
        break;
    }
  }

  return (
    <select name="songs" id="song-select" onChange={onChange}>
      <option value="">Choose a song:</option>
      <option value="ninteenOne">Phoenix - 1901</option>
      <option value="roxanne">The Police - Roxanne</option>
      <option value="aDayInTheLife">The Beatles - A Day In The Life</option>
      <option value="blueMonday">New Order - Blue Monday</option>
      <option value="justDance">Lady Gaga - Just Dance</option>
    </select>
  );
}

export default SongSelect;
