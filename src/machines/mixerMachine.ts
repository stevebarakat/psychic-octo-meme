import { createMachine, assign } from "xstate";
import { localStorageGet, localStorageSet } from "@/utils";
import { setSourceSong } from "./init";
import { defaultTrackData } from "@/assets/songs/defaultData";
import { produce } from "immer";
import {
  start as initializeAudio,
  getContext as getAudioContext,
  Transport as t,
  Reverb,
  FeedbackDelay,
  PitchShift,
} from "tone";

setSourceSong();
const audioContext = getAudioContext();
const sourceSong = localStorageGet("sourceSong");
const currentMain = localStorageGet("currentMain");
const currentTracks = localStorageGet("currentTracks");

export type MixerContext = {
  currentMain: MainSettings;
  currentTracks: TrackSettings[];
  sourceSong: SourceSong;
};

type SoloMuteType = { solo: boolean; mute: boolean };

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
      LOAD_SONG: { actions: "loadSong" },
      RESET: { actions: "reset", target: "stopped" },
      REWIND: { actions: "rewind" },
      FF: { actions: "fastForward" },
      SET_MAIN_VOLUME: { actions: "setMainVolume" },
      SET_TRACK_VOLUME: { actions: "setTrackVolume" },
      SET_TRACK_PAN: { actions: "setPan" },
      SET_TRACK_SOLOMUTE: { actions: "toggleSoloMute" },
      SET_TRACK_FX_NAMES: { actions: "setTrackFxNames" },
      SET_ACTIVE_TRACK_PANELS: { actions: "setActiveTrackPanels" },
      SET_TRACK_REVERB_BYPASS: { actions: "setTrackReverbBypass" },
      SET_TRACK_REVERB_MIX: { actions: "setTrackReverbMix" },
      SET_TRACK_REVERB_PREDELAY: { actions: "setTrackReverbPreDelay" },
      SET_TRACK_REVERB_DECAY: { actions: "setTrackReverbDecay" },
      SET_TRACK_DELAY_BYPASS: { actions: "setTrackDelayBypass" },
      SET_TRACK_DELAY_MIX: { actions: "setTrackDelayMix" },
      SET_TRACK_DELAY_TIME: { actions: "setTrackDelayTime" },
      SET_TRACK_DELAY_FEEDBACK: { actions: "setTrackDelayFeedback" },
      SET_TRACK_PITCHSHIFT_BYPASS: {
        actions: "setTrackPitchShiftBypass",
      },
      SET_TRACK_PITCHSHIFT_MIX: { actions: "setTrackPitchShiftMix" },
      SET_TRACK_PITCHSHIFT_PITCH: { actions: "setTrackPitchShiftPitch" },
      SET_TRACK_PANEL_SIZE: { actions: "setTrackPanelSize" },
      SET_TRACK_PANEL_POSITON: { actions: "setTrackPanelPosition" },
      SET_PLAYBACK_MODE: { actions: "setPlaybackMode" },
      SET_FX_PLAYBACK_MODE: { actions: "setFxPlaybackMode" },
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
        | { type: "LOAD_SONG" }
        | { type: "LOADED" }
        | { type: "PLAY" }
        | { type: "PAUSE" }
        | { type: "REWIND" }
        | { type: "FF" }
        | { type: "RESET" }
        | { type: "SET_MAIN_VOLUME"; value: number }
        | { type: "SET_TRACK_VOLUME"; value: number; trackId: number }
        | { type: "SET_TRACK_PAN"; value: number; trackId: number }
        | { type: "SET_TRACK_SOLOMUTE"; value: SoloMuteType; trackId: number }
        | {
            type: "SET_TRACK_FX_NAMES";
            trackId: number;
            fxId: number;
            action: string;
            channels: Channel[];
            value: string;
          }
        | {
            type: "SET_TRACK_REVERB_BYPASS";
            checked: boolean;
            reverb: Reverb;
            trackId: number;
            fxId: number;
          }
        | {
            type: "SET_TRACK_REVERB_MIX";
            value: number;
            reverb: Reverb;
            trackId: number;
            fxId: number;
          }
        | {
            type: "SET_TRACK_REVERB_PREDELAY";
            value: number;
            reverb: Reverb;
            trackId: number;
            fxId: number;
          }
        | {
            type: "SET_TRACK_REVERB_DECAY";
            value: number;
            reverb: Reverb;
            trackId: number;
            fxId: number;
          }
        | {
            type: "SET_TRACK_DELAY_BYPASS";
            checked: boolean;
            delay: FeedbackDelay;
            trackId: number;
            fxId: number;
          }
        | {
            type: "SET_TRACK_DELAY_MIX";
            value: number;
            delay: FeedbackDelay;
            trackId: number;
            fxId: number;
          }
        | {
            type: "SET_TRACK_DELAY_TIME";
            value: number;
            delay: FeedbackDelay;
            trackId: number;
            fxId: number;
          }
        | {
            type: "SET_TRACK_DELAY_FEEDBACK";
            value: number;
            delay: FeedbackDelay;
            trackId: number;
            fxId: number;
          }
        | {
            type: "SET_TRACK_PITCHSHIFT_BYPASS";
            checked: boolean;
            pitchShift: PitchShift;
            trackId: number;
            fxId: number;
          }
        | {
            type: "SET_TRACK_PITCHSHIFT_MIX";
            value: number;
            pitchShift: PitchShift;
            trackId: number;
            fxId: number;
          }
        | {
            type: "SET_TRACK_PITCHSHIFT_PITCH";
            value: number;
            pitchShift: PitchShift;
            trackId: number;
            fxId: number;
          }
        | { type: "SET_ACTIVE_TRACK_PANELS"; trackId: number }
        | {
            type: "SET_TRACK_PANEL_SIZE";
            trackId: number;
            width: string;
          }
        | {
            type: "SET_TRACK_PANEL_POSITON";
            trackId: number;
            x: number;
            y: number;
          }
        | {
            type: "SET_PLAYBACK_MODE";
            value: string;
            param: "volume" | "pan" | "soloMute";
            trackId: number;
          }
        | {
            type: "SET_FX_PLAYBACK_MODE";
            value: string;
            param: "volume" | "pan" | "soloMute";
            trackId: number;
          },
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

      loadSong: assign((context, { value }: any): any => {
        window.location.reload();
        localStorageSet("sourceSong", value);
        const currentTracks = value.tracks.map((track: TrackSettings) => ({
          id: crypto.randomUUID(),
          name: track.name,
          path: track.path,
          ...defaultTrackData,
        }));
        context.currentTracks = currentTracks;
        localStorageSet("currentTracks", currentTracks);
      }),

      setMainVolume: assign((context, { value }) => {
        return produce(context, (draft) => {
          draft.currentMain.volume = value;
        });
      }),

      setTrackVolume: assign((context, { value, trackId }) => {
        return produce(context, (draft) => {
          draft.currentTracks[trackId].volume = value;
        });
      }),

      setPan: assign((context, { value, trackId }) => {
        return produce(context, (draft) => {
          draft.currentTracks[trackId].pan = value;
        });
      }),

      toggleSoloMute: assign((context, { value, trackId }) => {
        const currentTracks = localStorageGet("currentTracks");
        currentTracks[trackId].soloMute = value;
        localStorageSet("currentTracks", currentTracks);
        return produce(context, (draft) => {
          draft.currentTracks[trackId].soloMute = value;
        });
      }),

      setTrackFxNames: assign(
        (context, { trackId, fxId, action, channels, value }) => {
          const currentTracks = localStorageGet("currentTracks");
          if (action === "remove") {
            channels[trackId].disconnect();
            return produce(context, (draft) => {
              draft.currentTracks[trackId].fxNames.splice(fxId, 1);
              currentTracks[trackId].fxNames.splice(fxId, 1);
              localStorageSet("currentTracks", currentTracks);
            });
          } else {
            return produce(context, (draft) => {
              draft.currentTracks[trackId].fxNames[fxId] = value;
              currentTracks[trackId].fxNames[fxId] = value;
              localStorageSet("currentTracks", currentTracks);
            });
          }
        }
      ),

      setTrackReverbBypass: assign(
        (context, { checked, reverb, trackId, fxId }) => {
          if (checked) {
            reverb?.disconnect();
          } else {
            reverb?.toDestination();
          }

          const currentTracks = localStorageGet("currentTracks");
          currentTracks[trackId].reverbSettings.reverbBypass[fxId] = checked;
          localStorageSet("currentTracks", currentTracks);

          return produce(context, (draft) => {
            draft.currentTracks[trackId].reverbSettings.reverbBypass[fxId] =
              checked;
          });
        }
      ),

      setTrackReverbMix: assign((context, { value, reverb, trackId, fxId }) => {
        reverb.wet.value = value;
        return produce(context, (draft) => {
          draft.currentTracks[trackId].reverbSettings.reverbMix[fxId] = value;
        });
      }),

      setTrackReverbPreDelay: assign(
        (context, { value, reverb, trackId, fxId }) => {
          reverb.preDelay = value;
          return produce(context, (draft) => {
            draft.currentTracks[trackId].reverbSettings.reverbPreDelay[fxId] =
              value;
          });
        }
      ),

      setTrackReverbDecay: assign(
        (context, { value, reverb, trackId, fxId }) => {
          reverb.decay = value;
          return produce(context, (draft) => {
            draft.currentTracks[trackId].reverbSettings.reverbDecay[fxId] =
              value;
          });
        }
      ),

      setTrackDelayBypass: assign(
        (context, { checked, delay, trackId, fxId }) => {
          if (checked) {
            delay?.disconnect();
          } else {
            delay?.toDestination();
          }
          const currentTracks = localStorageGet("currentTracks");
          currentTracks[trackId].delaySettings.delayBypass[fxId] = checked;
          localStorageSet("currentTracks", currentTracks);
          return produce(context, (draft) => {
            draft.currentTracks[trackId].delaySettings.delayBypass[fxId] =
              checked;
          });
        }
      ),

      setTrackDelayMix: assign((context, { value, delay, trackId, fxId }) => {
        delay.wet.value = value;
        return produce(context, (draft) => {
          draft.currentTracks[trackId].delaySettings.delayMix[fxId] = value;
        });
      }),

      setTrackDelayTime: assign((context, { value, delay, trackId, fxId }) => {
        delay.delayTime.value = value;
        return produce(context, (draft) => {
          draft.currentTracks[trackId].delaySettings.delayTime[fxId] = value;
        });
      }),

      setTrackDelayFeedback: assign(
        (context, { value, delay, trackId, fxId }) => {
          delay.feedback.value = value;
          return produce(context, (draft) => {
            draft.currentTracks[trackId].delaySettings.delayFeedback[fxId] =
              value;
          });
        }
      ),

      setTrackPitchShiftBypass: assign(
        (context, { checked, pitchShift, trackId, fxId }) => {
          if (checked) {
            pitchShift?.disconnect();
          } else {
            pitchShift?.toDestination();
          }
          const currentTracks = localStorageGet("currentTracks");
          currentTracks[trackId].pitchShiftSettings.pitchShiftBypass[fxId] =
            checked;
          localStorageSet("currentTracks", currentTracks);
          return produce(context, (draft) => {
            draft.currentTracks[trackId].pitchShiftSettings.pitchShiftBypass[
              fxId
            ] = checked;
          });
        }
      ),

      setTrackPitchShiftMix: assign(
        (context, { value, pitchShift, trackId, fxId }) => {
          pitchShift.wet.value = value;
          return produce(context, (draft) => {
            draft.currentTracks[trackId].pitchShiftSettings.pitchShiftMix[
              fxId
            ] = value;
          });
        }
      ),

      setTrackPitchShiftPitch: assign(
        (context, { value, pitchShift, trackId, fxId }) => {
          pitchShift.pitch = value;
          return produce(context, (draft) => {
            draft.currentTracks[trackId].pitchShiftSettings.pitchShiftPitch[
              fxId
            ] = value;
          });
        }
      ),

      setActiveTrackPanels: assign((context, { trackId }) => {
        const currentTracks = localStorageGet("currentTracks");
        currentTracks[trackId].panelActive =
          !currentTracks[trackId].panelActive;
        localStorageSet("currentTracks", currentTracks);
        return produce(context, (draft) => {
          draft.currentTracks[trackId].panelActive =
            !draft.currentTracks[trackId].panelActive;
        });
      }),

      setTrackPanelSize: assign((context, { width, trackId }) => {
        const currentTracks = localStorageGet("currentTracks");
        currentTracks[trackId].panelSize.width = width;
        localStorageSet("currentTracks", currentTracks);
        return produce(context, (draft) => {
          draft.currentTracks[trackId].panelSize.width = width;
        });
      }),

      setTrackPanelPosition: assign((context, { x, y, trackId }) => {
        const currentTracks = localStorageGet("currentTracks");
        currentTracks[trackId].panelPosition = { x, y };
        localStorageSet("currentTracks", currentTracks);
        return produce(context, (draft) => {
          draft.currentTracks[trackId].panelPosition = { x, y };
        });
      }),

      setPlaybackMode: assign((context, { value, param, trackId }) => {
        const currentTracks = localStorageGet("currentTracks");
        currentTracks[trackId][`${param}Mode`] = value;
        localStorageSet("currentTracks", currentTracks);
        return produce(context, (draft) => {
          draft.currentTracks[trackId][`${param}Mode`] = value;
        });
      }),

      setFxPlaybackMode: assign((context, { value, param, trackId }) => {
        const currentTracks = localStorageGet("currentTracks");
        currentTracks[trackId][`${param}Settings`].playbackMode = value;
        localStorageSet("currentTracks", currentTracks);
        return produce(context, (draft) => {
          draft.currentTracks[trackId][`${param}Settings`].playbackMode = value;
        });
      }),
    },
  }
);
