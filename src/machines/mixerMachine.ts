import { createMachine, assign } from "xstate";
import { localStorageGet, localStorageSet } from "../utils";
import { dbToPercent, log } from "../utils/scale";
import { roxanne } from "../assets/songs";
import {
  start as initializeAudio,
  getContext as getAudioContext,
  Destination,
  Transport as t,
} from "tone";

const audioContext = getAudioContext();
const getSourceSong = () => {
  const sourceSong = localStorageGet("sourceSong");
  if (!sourceSong) {
    localStorageSet("sourceSong", roxanne);
    window.location.reload();
  }
  return sourceSong;
};
const sourceSong = getSourceSong();
const currentMain = localStorageGet("currentMain");
const currentTracks = localStorageGet("currentTracks");

export type MixerContext = {
  currentMain: MainSettings;
  currentTracks: TrackSettings[];
  sourceSong: SourceSong;
};

const initialContext: MixerContext = {
  currentMain,
  currentTracks,
  sourceSong,
};

export const mixerMachine = createMachine(
  {
    id: "mixer",
    initial: "loading",
    tsTypes: {} as import("./mixerMachine.typegen").Typegen0,
    context: initialContext,
    on: {
      RESET: { actions: "reset", target: "stopped" },
      REWIND: { actions: "rewind" },
      FF: { actions: "fastForward" },
      SET_MAIN_VOLUME: { actions: "setMainVolume" },
      SET_TRACK_VOLUME: { actions: "setTrackVolume" },
      SET_TRACK_PAN: { actions: "setPan" },
      SET_TRACK_SOLO: { actions: "toggleSolo" },
      SET_TRACK_MUTE: { actions: "toggleMute" },
      SET_TRACK_SOLOMUTE: { actions: "toggleSoloMute" },
      SET_TRACK_FX_NAMES: { actions: "setTrackFxNames" },
      SET_ACTIVE_TRACK_PANELS: { actions: "setActiveTrackPanels" },
      SET_TRACK_DELAY_BYPASS: { actions: "setTrackDelayBypass" },
      SET_TRACK_DELAY_MIX: { actions: "setTrackDelayMix" },
      SET_TRACK_DELAY_TIME: { actions: "setTrackDelayTime" },
      SET_TRACK_DELAY_FEEDBACK: { actions: "setTrackDelayFeedback" },
      SET_TRACK_REVERB_BYPASS: { actions: "setTrackReverbBypass" },
      SET_TRACK_REVERB_MIX: { actions: "setTrackReverbMix" },
      SET_TRACK_REVERB_PREDELAY: { actions: "setTrackReverbPreDelay" },
      SET_TRACK_REVERB_DECAY: { actions: "setTrackReverbDecay" },
      SET_TRACK_PITCHSHIFT_BYPASS: {
        actions: "setTrackPitchShiftBypass",
      },
      SET_TRACK_PITCHSHIFT_MIX: { actions: "setTrackPitchShiftMix" },
      SET_TRACK_PITCHSHIFT_PITCH: { actions: "setTrackPitchShiftPitch" },
      SET_TRACK_PANEL_SIZE: { actions: "setTrackPanelSize" },
      SET_TRACK_PANEL_POSITON: { actions: "setTrackPanelPosition" },
      SET_PLAYBACK_MODE: { actions: "setPlaybackMode" },
    },
    states: {
      loading: { on: { LOADED: "stopped" } },
      playing: {
        entry: "play",
        on: {
          PAUSE: { target: "stopped", actions: "pause" },
        },
      },
      stopped: {
        on: {
          PLAY: { target: "playing" },
        },
      },
    },
    schema: {
      context: {} as typeof initialContext,
      events: {} as
        | { type: "LOADED" }
        | { type: "PLAY" }
        | { type: "PAUSE" }
        | { type: "REWIND" }
        | { type: "FF" }
        | { type: "RESET" }
        | { type: "SET_TRACK_SOLO" }
        | { type: "SET_TRACK_MUTE" }
        | { type: "SET_TRACK_SOLOMUTE" }
        | { type: "SET_TRACK_FX_NAMES" }
        | { type: "SET_TRACK_PAN" }
        | { type: "SET_ACTIVE_TRACK_PANELS" }
        | { type: "SET_MAIN_VOLUME" }
        | { type: "SET_TRACK_VOLUME" }
        | { type: "SET_TRACK_DELAY_BYPASS" }
        | { type: "SET_TRACK_DELAY_MIX" }
        | { type: "SET_TRACK_DELAY_TIME" }
        | { type: "SET_TRACK_DELAY_FEEDBACK" }
        | { type: "SET_TRACK_REVERB_BYPASS" }
        | { type: "SET_TRACK_REVERB_MIX" }
        | { type: "SET_TRACK_REVERB_PREDELAY" }
        | { type: "SET_TRACK_REVERB_DECAY" }
        | { type: "SET_TRACK_PITCHSHIFT_BYPASS" }
        | { type: "SET_TRACK_PITCHSHIFT_MIX" }
        | { type: "SET_TRACK_PITCHSHIFT_PITCH" }
        | { type: "SET_TRACK_PANEL_SIZE" }
        | { type: "SET_TRACK_PANEL_POSITON" }
        | { type: "SET_PLAYBACK_MODE" },
    },
    predictableActionArguments: true,
    preserveActionOrder: true,
  },

  {
    actions: {
      play: () => {
        if (audioContext.state === "suspended") {
          initializeAudio();
          t.start();
        } else {
          t.start();
        }
      },
      pause: () => t.pause(),
      reset: () => {
        t.stop();
        t.seconds = sourceSong.start ?? 0;
      },
      fastForward: () =>
        (t.seconds =
          t.seconds < sourceSong.end - 10
            ? t.seconds + 10
            : (t.seconds = sourceSong.end)),

      rewind: () =>
        (t.seconds =
          t.seconds > 10 + sourceSong.start
            ? t.seconds - 10
            : sourceSong.start),

      setMainVolume: assign((context, { value }: any): any => {
        context.currentMain.volume = value;
        const scaled = dbToPercent(log(value));
        Destination.volume.value = scaled;
      }),

      setTrackVolume: assign(
        (context, { value, channels, trackId }: any): any => {
          context.currentTracks[trackId].volume = value;
          const scaled = dbToPercent(log(value));
          channels[trackId].volume.value = scaled;
        }
      ),

      setPan: assign((context, { value, trackId, channels }: any): any => {
        channels[trackId].pan.value = value;
        context.currentTracks[trackId].pan = value;
      }),

      toggleMute: assign((context, { trackId, value, channels }: any): any => {
        channels[trackId].mute = value;
        context.currentTracks[trackId].mute = value;
        const currentTracks = localStorageGet("currentTracks");
        currentTracks[trackId].mute = value;
        localStorageSet("currentTracks", currentTracks);
      }),

      toggleSolo: assign((context, { trackId, value, channels }: any): any => {
        channels[trackId].solo = value;
        context.currentTracks[trackId].solo = value;
        const currentTracks = localStorageGet("currentTracks");
        currentTracks[trackId].solo = value;
        localStorageSet("currentTracks", currentTracks);
      }),

      toggleSoloMute: assign(
        (context, { trackId, value, value2, channels }: any): any => {
          console.log("value", value);
          console.log("value2", value2);
          const currentTracks = localStorageGet("currentTracks");
          channels[trackId].solo = value;
          context.currentTracks[trackId].solo = value;
          currentTracks[trackId].solo = value;
          if (value2) {
            channels[trackId].mute = value2;
            context.currentTracks[trackId].mute = value2;
            currentTracks[trackId].mute = value2;
          }
          localStorageSet("currentTracks", currentTracks);
        }
      ),

      setTrackFxNames: assign((context, { trackId, value }: any): any => {
        context.currentTracks[trackId].fxNames = value;
        const currentTracks = localStorageGet("currentTracks");
        currentTracks[trackId].fxNames = value;
        localStorageSet("currentTracks", currentTracks);
      }),

      setTrackReverbBypass: assign(
        (context, { checked, reverb, trackId, fxId }: any): any => {
          context.currentTracks[trackId].reverbBypass[fxId] = checked;
          if (checked) {
            reverb?.disconnect();
          } else {
            reverb?.toDestination();
          }
          const currentTracks = localStorageGet("currentTracks");
          currentTracks[trackId].reverbBypass[fxId] = checked;
          localStorageSet("currentTracks", currentTracks);
        }
      ),

      setTrackReverbMix: assign(
        (context, { value, reverb, trackId, fxId }: any): any => {
          context.currentTracks[trackId].reverbMix[fxId] = value;
          reverb.wet.value = value;
        }
      ),

      setTrackReverbPreDelay: assign(
        (context, { value, reverb, trackId, fxId }: any): any => {
          context.currentTracks[trackId].reverbPreDelay[fxId] = value;
          reverb.preDelay = value;
        }
      ),

      setTrackReverbDecay: assign(
        (context, { value, reverb, trackId, fxId }: any): any => {
          context.currentTracks[trackId].reverbDecay[fxId] = value;
          reverb.decay = value;
        }
      ),

      setTrackDelayBypass: assign(
        (context, { checked, delay, trackId, fxId }: any): any => {
          context.currentTracks[trackId].delayBypass[fxId] = checked;
          if (checked) {
            delay?.disconnect();
          } else {
            delay?.toDestination();
          }
          const currentTracks = localStorageGet("currentTracks");
          currentTracks[trackId].delayBypass[fxId] = checked;
          localStorageSet("currentTracks", currentTracks);
        }
      ),

      setTrackDelayMix: assign(
        (context, { value, delay, trackId, fxId }: any): any => {
          context.currentTracks[trackId].delayMix[fxId] = value;
          delay.wet.value = value;
        }
      ),

      setTrackDelayTime: assign(
        (context, { value, delay, trackId, fxId }: any): any => {
          context.currentTracks[trackId].delayTime[fxId] = value;
          delay.delayTime.value = value;
        }
      ),

      setTrackDelayFeedback: assign(
        (context, { value, delay, trackId, fxId }: any): any => {
          context.currentTracks[trackId].delayFeedback[fxId] = value;
          delay.feedback.value = value;
        }
      ),

      setTrackPitchShiftBypass: assign(
        (context, { checked, pitchShift, trackId, fxId }: any): any => {
          context.currentTracks[trackId].pitchShiftBypass[fxId] = checked;
          if (checked) {
            pitchShift?.disconnect();
          } else {
            pitchShift?.toDestination();
          }
          const currentTracks = localStorageGet("currentTracks");
          currentTracks[trackId].pitchShiftBypass[fxId] = checked;
          localStorageSet("currentTracks", currentTracks);
        }
      ),

      setTrackPitchShiftMix: assign(
        (context, { value, pitchShift, trackId, fxId }: any): any => {
          context.currentTracks[trackId].pitchShiftMix[fxId] = value;
          pitchShift.wet.value = value;
        }
      ),

      setTrackPitchShiftPitch: assign(
        (context, { value, pitchShift, trackId, fxId }: any): any => {
          context.currentTracks[trackId].pitchShiftPitch[fxId] = value;
          pitchShift.pitch = value;
        }
      ),

      setTrackPanelSize: assign((context, { width, trackId }: any): any => {
        context.currentTracks[trackId].panelSize.width = width;
        const currentTracks = localStorageGet("currentTracks");
        currentTracks[trackId].panelSize.width = width;
        localStorageSet("currentTracks", currentTracks);
      }),

      setTrackPanelPosition: assign((context, { x, y, trackId }: any): any => {
        context.currentTracks[trackId].panelPosition = { x, y };
        const currentTracks = localStorageGet("currentTracks");
        currentTracks[trackId].panelPosition = { x, y };
        localStorageSet("currentTracks", currentTracks);
      }),

      setActiveTrackPanels: assign((context, { trackId }: any): any => {
        context.currentTracks[trackId].panelActive =
          !context.currentTracks[trackId].panelActive;
        const currentTracks = localStorageGet("currentTracks");
        currentTracks[trackId].panelActive =
          context.currentTracks[trackId].panelActive;
        localStorageSet("currentTracks", currentTracks);
      }),

      setPlaybackMode: assign(
        (context, { value, param, trackId }: any): any => {
          context.currentTracks[trackId][`${param}Mode`] = value;
          const currentTracks = localStorageGet("currentTracks");
          currentTracks[trackId][`${param}Mode`] = value;
          localStorageSet("currentTracks", currentTracks);
        }
      ),
    },
  }
);
