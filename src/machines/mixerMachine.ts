import { createMachine, assign } from "xstate";
import { localStorageGet, localStorageSet } from "@/utils";
import { produce } from "immer";
import {
  start as initializeAudio,
  getContext as getAudioContext,
  Transport as t,
} from "tone";

const audioContext = getAudioContext();
const sourceSong = localStorageGet("sourceSong");
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
        | { type: "SET_MAIN_VOLUME"; value: number }
        | { type: "SET_TRACK_VOLUME"; value: number; trackId: string }
        | { type: "SET_TRACK_PAN" }
        | { type: "SET_TRACK_SOLOMUTE"; value: number; trackId: string }
        | { type: "SET_TRACK_FX_NAMES" }
        | { type: "SET_ACTIVE_TRACK_PANELS" }
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

      setMainVolume: assign((context, { value }) => {
        return produce(context, (draft) => {
          draft.currentMain.volume = value;
        });
      }),

      setTrackVolume: assign((context, { value, trackId }) => {
        return produce(context, (draft) => {
          draft.currentTracks[parseInt(trackId, 10)].volume = value;
        });
      }),

      setPan: assign((context, { value, trackId }) => {
        return produce(context, (draft) => {
          draft.currentTracks[parseInt(trackId, 10)].pan = value;
        });
      }),

      toggleSoloMute: assign((context, { trackId, value, value2 }) => {
        context.currentTracks[trackId].soloMute = [value, value2];
        const currentTracks = localStorageGet("currentTracks");
        currentTracks[trackId].soloMute = [value, value2];
        localStorageSet("currentTracks", currentTracks);
      }),

      setTrackFxNames: assign((context, { trackId, value }) => {
        context.currentTracks[trackId].fxNames = value;
        const currentTracks = localStorageGet("currentTracks");
        currentTracks[trackId].fxNames = value;
        localStorageSet("currentTracks", currentTracks);
      }),

      setTrackReverbBypass: assign(
        (context, { checked, reverb, trackId, fxId }) => {
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

      setTrackReverbMix: assign((context, { value, reverb, trackId, fxId }) => {
        context.currentTracks[trackId].reverbMix[fxId] = value;
        reverb.wet.value = value;
      }),

      setTrackReverbPreDelay: assign(
        (context, { value, reverb, trackId, fxId }) => {
          context.currentTracks[trackId].reverbPreDelay[fxId] = value;
          reverb.preDelay = value;
        }
      ),

      setTrackReverbDecay: assign(
        (context, { value, reverb, trackId, fxId }) => {
          context.currentTracks[trackId].reverbDecay[fxId] = value;
          reverb.decay = value;
        }
      ),

      setTrackDelayBypass: assign(
        (context, { checked, delay, trackId, fxId }) => {
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

      setTrackDelayMix: assign((context, { value, delay, trackId, fxId }) => {
        context.currentTracks[trackId].delayMix[fxId] = value;
        delay.wet.value = value;
      }),

      setTrackDelayTime: assign((context, { value, delay, trackId, fxId }) => {
        context.currentTracks[trackId].delayTime[fxId] = value;
        delay.delayTime.value = value;
      }),

      setTrackDelayFeedback: assign(
        (context, { value, delay, trackId, fxId }) => {
          context.currentTracks[trackId].delayFeedback[fxId] = value;
          delay.feedback.value = value;
        }
      ),

      setTrackPitchShiftBypass: assign(
        (context, { checked, pitchShift, trackId, fxId }) => {
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
        (context, { value, pitchShift, trackId, fxId }) => {
          context.currentTracks[trackId].pitchShiftMix[fxId] = value;
          pitchShift.wet.value = value;
        }
      ),

      setTrackPitchShiftPitch: assign(
        (context, { value, pitchShift, trackId, fxId }) => {
          context.currentTracks[trackId].pitchShiftPitch[fxId] = value;
          pitchShift.pitch = value;
        }
      ),

      setTrackPanelSize: assign((context, { width, trackId }) => {
        context.currentTracks[trackId].panelSize.width = width;
        const currentTracks = localStorageGet("currentTracks");
        currentTracks[trackId].panelSize.width = width;
        localStorageSet("currentTracks", currentTracks);
      }),

      setTrackPanelPosition: assign((context, { x, y, trackId }) => {
        context.currentTracks[trackId].panelPosition = { x, y };
        const currentTracks = localStorageGet("currentTracks");
        currentTracks[trackId].panelPosition = { x, y };
        localStorageSet("currentTracks", currentTracks);
      }),

      setActiveTrackPanels: assign((context, { trackId }) => {
        context.currentTracks[trackId].panelActive =
          !context.currentTracks[trackId].panelActive;
        const currentTracks = localStorageGet("currentTracks");
        currentTracks[trackId].panelActive =
          context.currentTracks[trackId].panelActive;
        localStorageSet("currentTracks", currentTracks);
      }),

      setPlaybackMode: assign((context, { value, param, trackId }) => {
        context.currentTracks[trackId][`${param}Mode`] = value;
        const currentTracks = localStorageGet("currentTracks");
        currentTracks[trackId][`${param}Mode`] = value;
        localStorageSet("currentTracks", currentTracks);
      }),
    },
  }
);
