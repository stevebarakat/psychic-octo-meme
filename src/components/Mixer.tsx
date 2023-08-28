import { Destination, Transport as t } from "tone";
import { log, dbToPercent } from "../utils";
import SongSelect from "./SongSelect";
import useTracks from "@/hooks/useTracks";
import { useDelay } from "./Track/Fx";
import Transport from "./Transport";
import { TrackPanel } from "./Track/TrackPanels";
import Loader from "./Loader";
import { Delay } from "./Track/Fx";
import SongInfo from "./SongInfo";
import { TrackChannel } from "./Track";
import Main from "./Main";
import { MixerMachineContext } from "@/context/MixerMachineContext";
import { useEffect } from "react";

export const Mixer = () => {
  const { currentTracks, currentMain, sourceSong } =
    MixerMachineContext.useSelector((state) => state.context);
  const tracks = sourceSong.tracks;
  const { channels } = useTracks({ tracks });
  const delay = useDelay();

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

  useEffect(() => {
    !isLoading && channels[3].connect(delay);
  }, [channels, isLoading, delay]);

  if (isLoading) {
    return <Loader song={sourceSong} />;
  } else {
    return (
      <>
        <div className="mixer">
          <SongInfo song={sourceSong} />
          <div className="channels">
            <TrackPanel trackId={3}>
              <Delay delay={delay} trackId={3} fxId={0} />
            </TrackPanel>
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
