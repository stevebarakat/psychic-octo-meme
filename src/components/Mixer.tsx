import { Destination, Transport as t } from "tone";
import { log, dbToPercent } from "../utils";
import SongSelect from "./SongSelect";
import useTracks from "@/hooks/useTracks";
import Transport from "./Transport";
import Loader from "./Loader";
import SongInfo from "./SongInfo";
import { TrackChannel } from "./Track";
import Main from "./Main";
import { MixerMachineContext } from "@/context/MixerMachineContext";

export const Mixer = () => {
  const { currentTracks, currentMain, sourceSong } =
    MixerMachineContext.useSelector((state) => state.context);
  const tracks = sourceSong.tracks;
  const { channels } = useTracks({ tracks });

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
        channels[trackId].set({ solo: currentTrack.soloMute[0] });
        channels[trackId].set({ mute: currentTrack.soloMute[1] });
      }
    });
  })();

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
              />
            ))}
            <Main />
          </div>
          <Transport song={sourceSong} />
        </div>
        <SongSelect />
      </>
    );
  }
};
