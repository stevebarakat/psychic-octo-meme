// This file was automatically generated. Edits will be overwritten

export interface Typegen0 {
  "@@xstate/typegen": true;
  internalEvents: {
    "xstate.init": { type: "xstate.init" };
  };
  invokeSrcNameMap: {};
  missingImplementations: {
    actions: never;
    delays: never;
    guards: never;
    services: never;
  };
  eventsCausingActions: {
    fastForward: "FF";
    pause: "PAUSE";
    play: "PLAY";
    reset: "RESET";
    rewind: "REWIND";
    rewindOverwrite: "REWIND_OVERWRITE";
    setActiveBusPanels: "SET_ACTIVE_BUS_PANELS";
    setActiveTrackPanels: "SET_ACTIVE_TRACK_PANELS";
    setBusDelayBypass: "SET_BUS_DELAY_BYPASS";
    setBusDelayFeedback: "SET_BUS_DELAY_FEEDBACK";
    setBusDelayMix: "SET_BUS_DELAY_MIX";
    setBusDelayTime: "SET_BUS_DELAY_TIME";
    setBusFxNames: "SET_BUS_FX_NAMES";
    setBusPanelPosition: "SET_BUS_PANEL_POSITON";
    setBusPanelSize: "SET_BUS_PANEL_SIZE";
    setBusPitchShiftBypass: "SET_BUS_PITCHSHIFT_BYPASS";
    setBusPitchShiftMix: "SET_BUS_PITCHSHIFT_MIX";
    setBusPitchShiftPitch: "SET_BUS_PITCHSHIFT_PITCH";
    setBusPlaybackMode: "SET_BUS_PLAYBACK_MODE";
    setBusReverbBypass: "SET_BUS_REVERB_BYPASS";
    setBusReverbDecay: "SET_BUS_REVERB_DECAY";
    setBusReverbMix: "SET_BUS_REVERB_MIX";
    setBusReverbPreDelay: "SET_BUS_REVERB_PREDELAY";
    setBusVolume: "SET_BUS_VOLUME";
    setGlobalPlaybackMode: "SET_GLOBAL_PLAYBACK_MODE";
    setMainVolume: "SET_MAIN_VOLUME";
    setPan: "SET_PAN";
    setPlaybackMode: "SET_PLAYBACK_MODE";
    setTrackDelayBypass: "SET_TRACK_DELAY_BYPASS";
    setTrackDelayFeedback: "SET_TRACK_DELAY_FEEDBACK";
    setTrackDelayMix: "SET_TRACK_DELAY_MIX";
    setTrackDelayTime: "SET_TRACK_DELAY_TIME";
    setTrackFxNames: "SET_TRACK_FX_NAMES";
    setTrackPanelPosition: "SET_TRACK_PANEL_POSITON";
    setTrackPanelSize: "SET_TRACK_PANEL_SIZE";
    setTrackPitchShiftBypass: "SET_TRACK_PITCHSHIFT_BYPASS";
    setTrackPitchShiftMix: "SET_TRACK_PITCHSHIFT_MIX";
    setTrackPitchShiftPitch: "SET_TRACK_PITCHSHIFT_PITCH";
    setTrackReverbBypass: "SET_TRACK_REVERB_BYPASS";
    setTrackReverbDecay: "SET_TRACK_REVERB_DECAY";
    setTrackReverbMix: "SET_TRACK_REVERB_MIX";
    setTrackReverbPreDelay: "SET_TRACK_REVERB_PREDELAY";
    setTrackVolume: "SET_TRACK_VOLUME";
    toggleMute: "TOGGLE_MUTE";
    toggleSends: "TOGGLE_SENDS";
    toggleSolo: "TOGGLE_SOLO";
  };
  eventsCausingDelays: {};
  eventsCausingGuards: {};
  eventsCausingServices: {};
  matchesStates: "loading" | "playing" | "stopped";
  tags: never;
}
