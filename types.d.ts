import type { Destination as ToneDestination } from "tone/build/esm/core/context/Destination";
import type { Gain as ToneGain, Channel as ToneChannel } from "tone";

declare global {
  type Destination = ToneDestination;
  type Channel = ToneChannel;
  type Gain = ToneGain;
  type BusChannel = Volume | null;

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
    volume: number;
    volumeMode: string;
    panMode: string;
    pan: number;
    soloMuteMode: string;
    soloMute: boolean[];
    sends: boolean[];
    fxNames: string[];
    delayMode: string[];
    delayBypass: boolean[];
    delayMix: number[];
    delayTime: number[];
    delayFeedback: number[];
    reverbMode: string[];
    reverbBypass: boolean[];
    reverbMix: number[];
    reverbPreDelay: number[];
    reverbDecay: number[];
    pitchShiftMode: string[];
    pitchShiftBypass: boolean[];
    pitchShiftMix: number[];
    pitchShiftPitch: number[];
    panelPosition: { x: number; y: number };
    panelSize: { width: string; height: string };
    panelActive: boolean;
  };

  type BusSettings = {
    id: string;
    name: string;
    volume: number;
    fxNames: string[];
    delayBypass: boolean[];
    delayMix: number[];
    delayTime: number[];
    delayFeedback: number[];
    reverbBypass: boolean[];
    reverbMix: number[];
    reverbPreDelay: number[];
    reverbDecay: number[];
    pitchShiftBypass: boolean[];
    pitchShiftMix: number[];
    pitchShiftPitch: number[];
    panelPosition: { x: number; y: number };
    panelSize: { width: string; height: string };
    panelActive: boolean;
  };
}
