import { useEffect } from "react";
import { Destination, Transport as t } from "tone";
import useBuses from "../hooks/useBuses";
import { log, dbToPercent, localStorageGet } from "../utils";
import SongSelect from "./SongSelect";
import useTracks from "../hooks/useTracks";
import Transport from "./Transport";
import Loader from "./Loader";
import SongInfo from "./SongInfo";
import { TrackChannel } from "./Track";
import Main from "./Main";
import BusChannel from "./Bus/BusChannel";
import { MixerMachineContext } from "@/context/MixerMachineContext";

type Props = {
  sourceSong: SourceSong;
};

export const Mixer = ({ sourceSong }: Props) => {
  const currentTracks = localStorageGet("currentTracks");
  const currentMain = localStorageGet("currentMain");
  const tracks = sourceSong.tracks;
  const { channels } = useTracks({ tracks });
  const [busChannels] = useBuses();

  (function loadSettings() {
    t.bpm.value = sourceSong.bpm;
    const volume = currentMain.volume;
    const scaled = dbToPercent(log(volume));
    Destination.volume.value = scaled;

    currentTracks.forEach((currentTrack: TrackSettings, trackId: number) => {
      const value = currentTrack.volume;
      const scaled = dbToPercent(log(value));

      if (channels[trackId]) {
        channels[trackId].set({ volume: scaled });
        channels[trackId].set({ pan: currentTrack.pan });
        channels[trackId].set({ solo: currentTrack.solo });
        channels[trackId].set({ mute: currentTrack.mute });
      }
    });
  })();

  useEffect(() => {
    currentTracks.forEach((currentTrack: TrackSettings, trackId: number) => {
      currentTrack.sends?.forEach((send, busId) => {
        if (send === true && busChannels.current[busId] && channels[trackId]) {
          channels[trackId].connect(busChannels.current[busId]!);
        }
      });
    });
  }, [busChannels, channels, currentTracks]);

  const isLoading = MixerMachineContext.useSelector((state) =>
    state.matches("loading")
  );
  if (isLoading) {
    return <Loader song={sourceSong} />;
  } else {
    return (
      <>
        <div className="mixer">
          <SongInfo song={sourceSong} />
          <div className="channels">
            {tracks.map((track, i) => (
              <TrackChannel
                key={track.path}
                track={track}
                trackId={i}
                channels={channels}
                busChannels={busChannels.current}
              />
            ))}
            {/* {busChannels.current.map((_: BusChannel, i: number) => (
              <BusChannel key={i} channels={busChannels.current} busId={i} />
            ))} */}
            <Main />
          </div>
          <Transport song={sourceSong} />
        </div>
        <SongSelect />
      </>
    );
  }
};
