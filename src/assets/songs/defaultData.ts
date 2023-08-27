export const defaultTrackData = {
  // MAIN
  volume: -32,
  volumeMode: "static",
  panMode: "static",
  soloMuteMode: "static",
  pan: 0,
  soloMute: { solo: false, mute: false },

  // FX
  fxNames: ["nofx", "nofx"],
  delaySettings: {
    delayMode: "static",
    delayBypass: [false, false],
    delayMix: [0.5, 0.5],
    delayTime: [1, 1],
    delayFeedback: [0.5, 0.5],
  },
  reverbSettings: {
    reverbMode: "static",
    reverbBypass: [false, false],
    reverbMix: [0.5, 0.5],
    reverbPreDelay: [0.5, 0.5],
    reverbDecay: [0.5, 0.5],
  },
  pitchShiftSettings: {
    pitchShiftMode: "static",
    pitchShiftBypass: [false, false],
    pitchShiftMix: [0.5, 0.5],
    pitchShiftPitch: [5, 5],
  },

  // PANELS
  panelPosition: { x: 0, y: 0 },
  panelActive: true,
  panelSize: { width: "325px", height: "auto" },
};
