import { createActorContext } from "@xstate/react";
import { mixerMachine } from "../machines/mixerMachine";

export const MixerMachineContext = createActorContext(mixerMachine);
