import type { Destination as ToneDestination } from "tone/build/esm/core/context/Destination";
import type { Gain as ToneGain, Channel as ToneChannel } from "tone";

declare global {
  type Destination = ToneDestination;
  type Channel = ToneChannel;
  type Gain = ToneGain;

  type Fx = {
    1: JSX.Element;
    2: JSX.Element;
  };

  type TrackFx = {
    nofx: Gain | null;
    reverb: Reverb | null;
    delay: FeedbackDelay | null;
    pitchShift: PitchShift | null;
  };

  type SourceSong = {
    id: string;
    slug: string;
    title: string;
    artist: string;
    year: string;
    studio: string;
    location: string;
    bpm: number;
    start: number;
    end: number;
    tracks: SourceTrack[];
  };

  type SourceTrack = {
    id: string;
    name: string;
    path: string;
  };

  type MainSettings = {
    volume: number;
  };

  type TrackSettings = {
    id: string;
    name: string;
    path: string;

    // MAIN
    volume: number;
    volumeMode: string;
    pan: number;
    panMode: string;
    soloMute: { solo: boolean; mute: boolean };
    soloMuteMode: string;

    // FX
    fxNames: string[];
    delaySettings: DelaySettings;
    reverbSettings: ReverbSettings;
    pitchShiftSettings: PitchShiftSettings;

    // PANELS
    panelPosition: { x: number; y: number };
    panelSize: { width: string; height: string };
    panelActive: boolean;
  };

  type DelaySettings = {
    playbackMode: string;
    delayBypass: boolean[];
    delayMix: number[];
    delayTime: number[];
    delayFeedback: number[];
  };

  type ReverbSettings = {
    playbackMode: string;
    reverbBypass: boolean[];
    reverbMix: number[];
    reverbPreDelay: number[];
    reverbDecay: number[];
  };

  type PitchShiftSettings = {
    playbackMode: string;
    pitchShiftBypass: boolean[];
    pitchShiftMix: number[];
    pitchShiftPitch: number[];
  };
}
