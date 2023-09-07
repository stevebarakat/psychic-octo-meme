import { createMachine } from "xstate";

export const machine = createMachine(
  {
    id: "Laura's Example 1",
    initial: "loading",
    states: {
      loading: {
        on: {
          LOADED: {
            target: "stopped",
          },
        },
      },
      stopped: {
        on: {
          PLAY: {
            target: "playing",
            actions: {
              type: "play",
              params: {},
            },
          },
          CHANGE_AUTOMATE_MODE: {
            actions: {
              type: "changeAutomateMode",
              params: {},
            },
            internal: true,
          },
        },
      },
      playing: {
        initial: "static",
        states: {
          static: {},
          automating: {},
          recording: {},
        },
        on: {
          PAUSE: {
            target: "stopped",
            actions: {
              type: "pause",
              params: {},
            },
          },
          RECORD: {
            target: ".recording",
            actions: {
              type: "record",
              params: {},
            },
            internal: true,
          },
          AUTOMATE: {
            target: ".automating",
            actions: {
              type: "automate",
              params: {},
            },
            internal: true,
          },
        },
      },
    },
    on: {
      RESET: {
        target: ".stopped",
        actions: {
          type: "reset",
          params: {},
        },
        internal: false,
      },
      REWIND: {
        actions: {
          type: "rewind",
          params: {},
        },
        internal: true,
      },
      FF: {
        actions: {
          type: "fastForward",
          params: {},
        },
        internal: true,
      },
      CHANGE_VOLUME: {
        actions: {
          type: "changeVolume",
          params: {},
        },
        internal: true,
      },
      CHANGE_MAIN_VOLUME: {
        actions: {
          type: "changeMainVolume",
          params: {},
        },
        internal: true,
      },
      CHANGE_PAN: {
        actions: {
          type: "changePan",
          params: {},
        },
        internal: true,
      },
      TOGGLE_SOLO: {
        actions: {
          type: "toggleSolo",
          params: {},
        },
        internal: true,
      },
      TOGGLE_MUTE: {
        actions: {
          type: "toggleMute",
          params: {},
        },
        internal: true,
      },
    },
    schema: {
      events: {} as
        | { type: "RESET" }
        | { type: "REWIND" }
        | { type: "FF" }
        | { type: "CHANGE_VOLUME" }
        | { type: "CHANGE_MAIN_VOLUME" }
        | { type: "CHANGE_PAN" }
        | { type: "TOGGLE_SOLO" }
        | { type: "TOGGLE_MUTE" }
        | { type: "LOADED" }
        | { type: "PAUSE" }
        | { type: "RECORD" }
        | { type: "AUTOMATE" }
        | { type: "PLAY" }
        | { type: "CHANGE_AUTOMATE_MODE" },
    },
    predictableActionArguments: true,
    preserveActionOrder: true,
  },
  {
    actions: {
      reset: (context, event) => {},

      rewind: (context, event) => {},

      fastForward: (context, event) => {},

      changeVolume: (context, event) => {},

      changeMainVolume: (context, event) => {},

      changePan: (context, event) => {},

      toggleSolo: (context, event) => {},

      toggleMute: (context, event) => {},

      pause: (context, event) => {},

      record: (context, event) => {},

      automate: (context, event) => {},

      play: (context, event) => {},

      changeAutomateMode: (context, event) => {},
    },
    services: {},
    guards: {},
    delays: {},
  }
);
