import { MixerMachineContext } from "@/context/MixerMachineContext";
import { TransportButton } from "../Buttons";
import { ffwdIcon } from "@/assets/icons";

export function FastForward() {
  const { send } = MixerMachineContext.useActorRef();

  return (
    <TransportButton
      onClick={() => {
        send("FF");
      }}
    >
      {ffwdIcon}
    </TransportButton>
  );
}
