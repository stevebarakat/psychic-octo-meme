import { MixerMachineContext } from "@/context/MixerMachineContext";
import { TransportButton } from "../Buttons";
import { playIcon, pauseIcon } from "@/assets/icons";

function Play() {
  const { send } = MixerMachineContext.useActorRef();
  const state = MixerMachineContext.useSelector((state) => state);

  function handleClick() {
    if (!state.matches("playing")) {
      send("PLAY");
    }
    if (state.matches("playing")) {
      send("PAUSE");
    }
  }

  return (
    <TransportButton onClick={handleClick}>
      {!state.matches("playing") ? playIcon : pauseIcon}
    </TransportButton>
  );
}

export default Play;
