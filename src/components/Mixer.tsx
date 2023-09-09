import { Destination, Transport as t } from "tone";
import Transport from "./Transport";
import { log, dbToPercent } from "../utils";
import SongSelect from "./SongSelect";
import useTracks from "@/hooks/useTracks";
import Loader from "./Loader";
import SongInfo from "./SongInfo";
import { TrackChannel } from "./Track";
import Main from "./Main";
import { MixerMachineContext } from "@/context/MixerMachineContext";

export const Mixer = () => {
  const { currentTracks, currentMain, sourceSong } =
    MixerMachineContext.useSelector((state) => state.context);

  if (!sourceSong) window.location.reload();

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
        channels[trackId].set({
          volume: scaled,
          pan: currentTrack.pan,
          solo: currentTrack.soloMute.solo,
          mute: currentTrack.soloMute.mute,
        });
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
                key={track.id}
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
