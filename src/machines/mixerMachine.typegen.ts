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
    loadSong: "LOAD_SONG";
    pause: "PAUSE";
    play: "PLAY";
    reset: "RESET";
    rewind: "REWIND";
    setActiveTrackPanels: "SET_ACTIVE_TRACK_PANELS";
    setFxPlaybackMode: "SET_FX_PLAYBACK_MODE";
    setMainVolume: "SET_MAIN_VOLUME";
    setPan: "SET_TRACK_PAN";
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
    toggleSoloMute: "SET_TRACK_SOLOMUTE";
  };
  eventsCausingDelays: {};
  eventsCausingGuards: {};
  eventsCausingServices: {};
  matchesStates: "loading" | "playing" | "stopped";
  tags: never;
}
