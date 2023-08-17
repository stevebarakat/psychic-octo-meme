import { MixerMachineContext } from "@/context/MixerMachineContext";
import TransportButton from "../Buttons/TransportButton";
import { restartIcon } from "../../assets/icons";

function Reset() {
  const { send } = MixerMachineContext.useActorRef();

  return (
    <TransportButton
      onClick={() => {
        send("RESET");
      }}
    >
      {restartIcon}
    </TransportButton>
  );
}

export default Reset;
