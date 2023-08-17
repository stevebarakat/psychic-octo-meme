import { MixerMachineContext } from "@/context/MixerMachineContext";
import TransportButton from "../Buttons/TransportButton";
import { rewIcon } from "../../assets/icons";

function Rewind() {
  const { send } = MixerMachineContext.useActorRef();

  const globalPlaybackMode = MixerMachineContext.useSelector(
    (state) => state.context.globalPlaybackMode
  );

  return (
    <TransportButton
      // disabled={globalPlaybackMode === "write"}
      onClick={() => {
        send("REWIND");
      }}
    >
      {rewIcon}
    </TransportButton>
  );
}

export default Rewind;
