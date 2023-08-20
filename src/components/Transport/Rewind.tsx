import { MixerMachineContext } from "@/context/MixerMachineContext";
import { TransportButton } from "../Buttons";
import { rewIcon } from "@/assets/icons";

function Rewind() {
  const { send } = MixerMachineContext.useActorRef();

  return (
    <TransportButton
      onClick={() => {
        send("REWIND");
      }}
    >
      {rewIcon}
    </TransportButton>
  );
}

export default Rewind;
