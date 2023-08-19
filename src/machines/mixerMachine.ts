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

export type Context = {
  currentMain: MainSettings;
  currentTracks: TrackSettings[];
  sourceSong: SourceSong;
  rewinding: boolean;
};

const initialContext: Context = {
  currentMain,
  currentTracks,
  sourceSong,
  rewinding: false,
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
      REWIND_OVERWRITE: { actions: "rewindOverwrite" },
      FF: { actions: "fastForward" },
      SET_MAIN_VOLUME: { actions: "setMainVolume" },
      SET_TRACK_VOLUME: { actions: "setTrackVolume" },
      SET_TRACK_PAN: { actions: "setPan" },
      TOGGLE_SOLO: { actions: "toggleSolo" },
      TOGGLE_MUTE: { actions: "toggleMute" },
      TOGGLE_SENDS: { actions: "toggleSends" },
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
        | { type: "REWIND_OVERWRITE" }
        | { type: "FF" }
        | { type: "RESET" }
        | { type: "TOGGLE_SOLO" }
        | { type: "TOGGLE_MUTE" }
        | { type: "TOGGLE_SENDS" }
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
        | { type: "SET_GLOBAL_PLAYBACK_MODE" }
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

      rewindOverwrite: assign((context, { value }: any): any => {
        context.rewinding = value;
      }),

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

      toggleMute: assign((context, { trackId, checked, channel }: any): any => {
        channel.mute = checked;
        context.currentTracks[trackId].mute = checked;
        const currentTracks = localStorageGet("currentTracks");
        currentTracks[trackId].mute = checked;
        localStorageSet("currentTracks", currentTracks);
      }),

      toggleSolo: assign((context, { trackId, checked, channel }: any): any => {
        channel.solo = checked;
        context.currentTracks[trackId].solo = checked;
        const currentTracks = localStorageGet("currentTracks");
        currentTracks[trackId].solo = checked;
        localStorageSet("currentTracks", currentTracks);
      }),

      toggleSends: assign(
        (context, { trackId, channels, busChannels, target }: any): any => {
          const busId = parseInt(target.id.at(-1), 10);
          if (target.checked) {
            channels[trackId].connect(busChannels[busId]);
            context.currentTracks[trackId].sends[busId] = true;
            const currentTracks = localStorageGet("currentTracks");
            currentTracks[trackId].sends[busId] = true;
            localStorageSet("currentTracks", currentTracks);
          } else {
            // channels[trackId].disconnect(busChannels[busId]);
            channels[trackId].toDestination();
            context.currentTracks[trackId].sends[busId] = false;
            const currentTracks = localStorageGet("currentTracks");
            currentTracks[trackId].sends[busId] = false;
            localStorageSet("currentTracks", currentTracks);
          }
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
        (context, { value, param, trackId, fxId }: any): any => {
          context.currentTracks[trackId][`${param}Mode`][fxId] = value;
          const currentTracks = localStorageGet("currentTracks");
          currentTracks[trackId][`${param}Mode`][fxId] = value;
          localStorageSet("currentTracks", currentTracks);
        }
      ),
    },
  }
);
