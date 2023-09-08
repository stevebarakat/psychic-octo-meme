import { createMachine, assign } from "xstate";
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
import { db } from "@/db";

export type MixerContext = {
  currentTracks: TrackSettings[];
  sourceSong: SourceSong;
};
type SoloMuteType = { solo: boolean; mute: boolean };

setSourceSong();
const audioContext = getAudioContext();
// let sourceSong;
// let currentTracks;

// async function getDefaultData() {
//   sourceSong = await db.sourceSong.where("id").equals("sourceSong");
//   currentTracks = await db.currentTracks.where("id").equals("currentTracks");
// }

async function getSourceSong() {
  return await db.sourceSong.where("id").equals("sourceSong").toArray();
}

async function getCurrentTracks() {
  return await db.currentTracks.where("id").equals("currentTracks").toArray();
}

const sourceSong = getSourceSong();
const currentTracks = getCurrentTracks();

const initialContext: MixerContext = {
  sourceSong: await sourceSong.then((song) => song[0]?.data),
  currentTracks: await currentTracks.then((track) => track[0]?.data),
};

console.log("initialContext", initialContext);
// {sourceSong: Promise, currentTracks: Promise}

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

      loadSong: assign(async (context, { value }: any): any => {
        // localStorageSet("sourceSong", value);
        console.log("context", context);
        await db.sourceSong.put({
          id: "sourceSong",
          data: { ...value },
        });
        const currentTracks = value.tracks.map((track: TrackSettings) => ({
          id: crypto.randomUUID(),
          name: track.name,
          path: track.path,
          ...defaultTrackData,
        }));
        context.currentTracks = currentTracks;
        // localStorageSet("currentTracks", currentTracks);
        await db.currentTracks.put({
          id: "currentTracks",
          data: currentTracks,
        });
        window.location.reload();
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
        currentTracks[trackId].soloMute = value;
        return produce(context, (draft) => {
          draft.currentTracks[trackId].soloMute = value;
        });
      }),

      setTrackFxNames: assign(
        (context, { trackId, fxId, action, channels, value }) => {
          if (action === "remove") {
            channels[trackId].disconnect();
            return produce(context, (draft) => {
              draft.currentTracks[trackId].fxNames.splice(fxId, 1);
            });
          } else {
            return produce(context, (draft) => {
              draft.currentTracks[trackId].fxNames[fxId] = value;
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

          currentTracks[trackId].reverbSettings.reverbBypass[fxId] = checked;

          return produce(context, (draft) => {
            draft.currentTracks[trackId].reverbSettings.reverbBypass[fxId] =
              checked;
          });
        }
      ),

      setTrackReverbMix: assign((context, { value, reverb, trackId, fxId }) => {
        if (reverb) reverb.wet.value = value;
        return produce(context, (draft) => {
          draft.currentTracks[trackId].reverbSettings.reverbMix[fxId] = value;
        });
      }),

      setTrackReverbPreDelay: assign(
        (context, { value, reverb, trackId, fxId }) => {
          if (reverb) reverb.preDelay = value;
          return produce(context, (draft) => {
            draft.currentTracks[trackId].reverbSettings.reverbPreDelay[fxId] =
              value;
          });
        }
      ),

      setTrackReverbDecay: assign(
        (context, { value, reverb, trackId, fxId }) => {
          if (reverb) reverb.decay = value;
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
          currentTracks[trackId].delaySettings.delayBypass[fxId] = checked;
          localStorageSet("currentTracks", currentTracks);
          return produce(context, (draft) => {
            draft.currentTracks[trackId].delaySettings.delayBypass[fxId] =
              checked;
          });
        }
      ),

      setTrackDelayMix: assign((context, { value, delay, trackId, fxId }) => {
        if (delay) delay.wet.value = value;
        return produce(context, (draft) => {
          draft.currentTracks[trackId].delaySettings.delayMix[fxId] = value;
        });
      }),

      setTrackDelayTime: assign((context, { value, delay, trackId, fxId }) => {
        if (delay) delay.delayTime.value = value;
        return produce(context, (draft) => {
          draft.currentTracks[trackId].delaySettings.delayTime[fxId] = value;
        });
      }),

      setTrackDelayFeedback: assign(
        (context, { value, delay, trackId, fxId }) => {
          if (delay) delay.feedback.value = value;
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
          return produce(context, (draft) => {
            draft.currentTracks[trackId].pitchShiftSettings.pitchShiftBypass[
              fxId
            ] = checked;
          });
        }
      ),

      setTrackPitchShiftMix: assign(
        (context, { value, pitchShift, trackId, fxId }) => {
          if (pitchShift) pitchShift.wet.value = value;
          return produce(context, (draft) => {
            draft.currentTracks[trackId].pitchShiftSettings.pitchShiftMix[
              fxId
            ] = value;
          });
        }
      ),

      setTrackPitchShiftPitch: assign(
        (context, { value, pitchShift, trackId, fxId }) => {
          if (pitchShift) pitchShift.pitch = value;
          return produce(context, (draft) => {
            draft.currentTracks[trackId].pitchShiftSettings.pitchShiftPitch[
              fxId
            ] = value;
          });
        }
      ),

      setActiveTrackPanels: assign((context, { trackId }) => {
        return produce(context, (draft) => {
          draft.currentTracks[trackId].panelActive =
            !draft.currentTracks[trackId].panelActive;
        });
      }),

      setTrackPanelSize: assign((context, { width, trackId }) => {
        return produce(context, (draft) => {
          draft.currentTracks[trackId].panelSize.width = width;
        });
      }),

      setTrackPanelPosition: assign((context, { x, y, trackId }) => {
        return produce(context, (draft) => {
          draft.currentTracks[trackId].panelPosition = { x, y };
        });
      }),

      setPlaybackMode: assign((context, { value, param, trackId }) => {
        return produce(context, (draft) => {
          draft.currentTracks[trackId][`${param}Mode`] = value;
        });
      }),

      setFxPlaybackMode: assign((context, { value, param, trackId }) => {
        return produce(context, (draft) => {
          draft.currentTracks[trackId][`${param}Settings`].playbackMode = value;
        });
      }),
    },
  }
);
