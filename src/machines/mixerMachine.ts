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
const currentBuses = localStorageGet("currentBuses");
const globalPlaybackMode = localStorageGet("globalPlaybackMode");

export type Context = {
  currentMain: MainSettings;
  currentTracks: TrackSettings[];
  currentBuses: BusSettings[];
  globalPlaybackMode: string;
  sourceSong: SourceSong;
  rewinding: boolean;
};

const initialContext: Context = {
  currentMain,
  currentTracks,
  currentBuses,
  globalPlaybackMode,
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
      SET_BUS_VOLUME: { actions: "setBusVolume" },
      SET_PAN: { actions: "setPan" },
      TOGGLE_SOLO: { actions: "toggleSolo" },
      TOGGLE_MUTE: { actions: "toggleMute" },
      TOGGLE_SENDS: { actions: "toggleSends" },
      SET_TRACK_FX_NAMES: { actions: "setTrackFxNames" },
      SET_BUS_FX_NAMES: { actions: "setBusFxNames" },
      SET_ACTIVE_TRACK_PANELS: { actions: "setActiveTrackPanels" },
      SET_ACTIVE_BUS_PANELS: { actions: "setActiveBusPanels" },
      SET_BUS_DELAY_BYPASS: { actions: "setBusDelayBypass" },
      SET_BUS_DELAY_MIX: { actions: "setBusDelayMix" },
      SET_BUS_DELAY_TIME: { actions: "setBusDelayTime" },
      SET_BUS_DELAY_FEEDBACK: { actions: "setBusDelayFeedback" },
      SET_TRACK_DELAY_BYPASS: { actions: "setTrackDelayBypass" },
      SET_TRACK_DELAY_MIX: { actions: "setTrackDelayMix" },
      SET_TRACK_DELAY_TIME: { actions: "setTrackDelayTime" },
      SET_TRACK_DELAY_FEEDBACK: { actions: "setTrackDelayFeedback" },
      SET_BUS_REVERB_BYPASS: { actions: "setBusReverbBypass" },
      SET_BUS_REVERB_MIX: { actions: "setBusReverbMix" },
      SET_BUS_REVERB_PREDELAY: { actions: "setBusReverbPreDelay" },
      SET_BUS_REVERB_DECAY: { actions: "setBusReverbDecay" },
      SET_TRACK_REVERB_BYPASS: { actions: "setTrackReverbBypass" },
      SET_TRACK_REVERB_MIX: { actions: "setTrackReverbMix" },
      SET_TRACK_REVERB_PREDELAY: { actions: "setTrackReverbPreDelay" },
      SET_TRACK_REVERB_DECAY: { actions: "setTrackReverbDecay" },
      SET_BUS_PITCHSHIFT_BYPASS: { actions: "setBusPitchShiftBypass" },
      SET_BUS_PITCHSHIFT_MIX: { actions: "setBusPitchShiftMix" },
      SET_BUS_PITCHSHIFT_PITCH: { actions: "setBusPitchShiftPitch" },
      SET_TRACK_PITCHSHIFT_BYPASS: {
        actions: "setTrackPitchShiftBypass",
      },
      SET_TRACK_PITCHSHIFT_MIX: { actions: "setTrackPitchShiftMix" },
      SET_TRACK_PITCHSHIFT_PITCH: { actions: "setTrackPitchShiftPitch" },
      SET_BUS_PANEL_SIZE: { actions: "setBusPanelSize" },
      SET_BUS_PANEL_POSITON: { actions: "setBusPanelPosition" },
      SET_TRACK_PANEL_SIZE: { actions: "setTrackPanelSize" },
      SET_TRACK_PANEL_POSITON: { actions: "setTrackPanelPosition" },
      SET_PLAYBACK_MODE: { actions: "setPlaybackMode" },
      SET_BUS_PLAYBACK_MODE: { actions: "setBusPlaybackMode" },
      SET_GLOBAL_PLAYBACK_MODE: { actions: "setGlobalPlaybackMode" },
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
        | { type: "SET_BUS_FX_NAMES" }
        | { type: "SET_PAN" }
        | { type: "SET_ACTIVE_TRACK_PANELS" }
        | { type: "SET_ACTIVE_BUS_PANELS" }
        | { type: "SET_MAIN_VOLUME" }
        | { type: "SET_TRACK_VOLUME" }
        | { type: "SET_BUS_VOLUME" }
        | { type: "SET_BUS_DELAY_BYPASS" }
        | { type: "SET_BUS_DELAY_MIX" }
        | { type: "SET_BUS_DELAY_TIME" }
        | { type: "SET_BUS_DELAY_FEEDBACK" }
        | { type: "SET_TRACK_DELAY_BYPASS" }
        | { type: "SET_TRACK_DELAY_MIX" }
        | { type: "SET_TRACK_DELAY_TIME" }
        | { type: "SET_TRACK_DELAY_FEEDBACK" }
        | { type: "SET_BUS_REVERB_BYPASS" }
        | { type: "SET_BUS_REVERB_MIX" }
        | { type: "SET_BUS_REVERB_PREDELAY" }
        | { type: "SET_BUS_REVERB_DECAY" }
        | { type: "SET_TRACK_REVERB_BYPASS" }
        | { type: "SET_TRACK_REVERB_MIX" }
        | { type: "SET_TRACK_REVERB_PREDELAY" }
        | { type: "SET_TRACK_REVERB_DECAY" }
        | { type: "SET_BUS_PITCHSHIFT_BYPASS" }
        | { type: "SET_BUS_PITCHSHIFT_MIX" }
        | { type: "SET_BUS_PITCHSHIFT_PITCH" }
        | { type: "SET_TRACK_PITCHSHIFT_BYPASS" }
        | { type: "SET_TRACK_PITCHSHIFT_MIX" }
        | { type: "SET_TRACK_PITCHSHIFT_PITCH" }
        | { type: "SET_BUS_PANEL_SIZE" }
        | { type: "SET_BUS_PANEL_POSITON" }
        | { type: "SET_TRACK_PANEL_SIZE" }
        | { type: "SET_TRACK_PANEL_POSITON" }
        | { type: "SET_BUS_PLAYBACK_MODE" }
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

      setBusVolume: assign((context, { value, channels, busId }: any): any => {
        context.currentBuses[busId].volume = value;
        const scaled = dbToPercent(log(value));
        channels[busId].volume.value = scaled;
      }),

      setPan: assign((context, { value, trackId, channel }: any): any => {
        channel.pan.value = value;
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

      setBusFxNames: assign((context, { busId, value }: any): any => {
        context.currentBuses[busId].fxNames = value;
        const currentBuses = localStorageGet("currentBuses");
        currentBuses[busId].fxNames = value;
        localStorageSet("currentBuses", currentBuses);
      }),

      setBusPitchShiftBypass: assign(
        (context, { checked, pitchShift, busId, fxId }: any): any => {
          context.currentBuses[busId].pitchShiftBypass[fxId] = checked;
          if (checked) {
            pitchShift?.disconnect();
          } else {
            pitchShift?.toDestination();
          }
          const currentBuses = localStorageGet("currentBuses");
          currentBuses[busId].pitchShiftBypass[fxId] = checked;
          localStorageSet("currentBuses", currentBuses);
        }
      ),

      setBusPitchShiftMix: assign(
        (context, { value, pitchShift, busId, fxId }: any): any => {
          context.currentBuses[busId].pitchShiftMix[fxId] = value;
          pitchShift.wet.value = value;
        }
      ),

      setBusPitchShiftPitch: assign(
        (context, { value, pitchShift, busId, fxId }: any): any => {
          context.currentBuses[busId].pitchShiftPitch[fxId] = value;
          pitchShift.pitch = value;
        }
      ),
      setBusDelayBypass: assign(
        (context, { checked, delay, busId, fxId }: any): any => {
          context.currentBuses[busId].delayBypass[fxId] = checked;
          if (checked) {
            delay?.disconnect();
          } else {
            delay?.toDestination();
          }
          const currentBuses = localStorageGet("currentBuses");
          currentBuses[busId].delayBypass[fxId] = checked;
          localStorageSet("currentBuses", currentBuses);
        }
      ),

      setBusDelayMix: assign(
        (context, { value, delay, busId, fxId }: any): any => {
          context.currentBuses[busId].delayMix[fxId] = value;
          delay.wet.value = value;
        }
      ),

      setBusDelayTime: assign(
        (context, { value, delay, busId, fxId }: any): any => {
          context.currentBuses[busId].delayTime[fxId] = value;
          delay.delayTime.value = value;
        }
      ),

      setBusDelayFeedback: assign(
        (context, { value, delay, busId, fxId }: any): any => {
          context.currentBuses[busId].delayFeedback[fxId] = value;
          delay.feedback.value = value;
        }
      ),

      setBusReverbBypass: assign(
        (context, { checked, reverb, busId, fxId }: any): any => {
          context.currentBuses[busId].reverbBypass[fxId] = checked;
          if (checked) {
            reverb?.disconnect();
          } else {
            reverb?.toDestination();
          }
          const currentBuses = localStorageGet("currentBuses");
          currentBuses[busId].reverbBypass[fxId] = checked;
          localStorageSet("currentBuses", currentBuses);
        }
      ),

      setBusReverbMix: assign(
        (context, { value, reverb, busId, fxId }: any): any => {
          context.currentBuses[busId].reverbMix[fxId] = value;
          reverb.wet.value = value;
        }
      ),

      setBusReverbPreDelay: assign(
        (context, { value, reverb, busId, fxId }: any): any => {
          context.currentBuses[busId].reverbPreDelay[fxId] = value;
          reverb.preDelay = value;
        }
      ),

      setBusReverbDecay: assign(
        (context, { value, reverb, busId, fxId }: any): any => {
          context.currentBuses[busId].reverbDecay[fxId] = value;
          reverb.decay = value;
        }
      ),

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

      setBusPanelSize: assign((context, { width, busId }: any): any => {
        context.currentBuses[busId].panelSize.width = width;
        const currentBuses = localStorageGet("currentBuses");
        currentBuses[busId].panelSize.width = width;
        localStorageSet("currentBuses", currentBuses);
      }),

      setBusPanelPosition: assign((context, { x, y, busId }: any): any => {
        context.currentBuses[busId].panelPosition = { x, y };
        const currentBuses = localStorageGet("currentBuses");
        currentBuses[busId].panelPosition = { x, y };
        localStorageSet("currentBuses", currentBuses);
      }),

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

      setActiveBusPanels: assign((context, { busId }: any): any => {
        context.currentBuses[busId].panelActive =
          !context.currentBuses[busId].panelActive;
        const currentBuses = localStorageGet("currentBuses");
        currentBuses[busId].panelActive =
          context.currentBuses[busId].panelActive;
        localStorageSet("currentBuses", currentBuses);
      }),

      setGlobalPlaybackMode: assign((context, { playbackMode }: any): any => {
        context.globalPlaybackMode = playbackMode;
        localStorageSet("globalPlaybackMode", playbackMode);
      }),

      setPlaybackMode: assign(
        (context, { value, param, trackId, fxId }: any): any => {
          context.currentTracks[trackId][`${param}Mode`][fxId] = value;
          const currentTracks = localStorageGet("currentTracks");
          currentTracks[trackId][`${param}Mode`][fxId] = value;
          localStorageSet("currentTracks", currentTracks);
        }
      ),

      setBusPlaybackMode: assign(
        (context, { value, param, busId, fxId }: any): any => {
          context.currentBuses[busId][`${param}Mode`][fxId] = value;
          const currentBuses = localStorageGet("currentBuses");
          currentBuses[busId][`${param}Mode`][fxId] = value;
          localStorageSet("currentBuses", currentBuses);
        }
      ),
    },
  }
);
