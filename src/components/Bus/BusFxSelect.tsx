import { MixerMachineContext } from "@/context/MixerMachineContext";
import BusPanels from "./BusPanels";
import ChannelButton from "../Buttons/ChannelButton";
import { localStorageGet, array } from "@/utils";

type Props = {
  busId: number;
  fx: Fx;
  saveBusFx: React.ChangeEventHandler<HTMLSelectElement>;
};

function BusFxSelect({ busId, fx, saveBusFx }: Props) {
  const [, send] = MixerMachineContext.useActor();
  const currentBuses = localStorageGet("currentBuses");

  const disabled = currentBuses[busId].fxNames.every(
    (item: string) => item === "nofx"
  );

  function handleClick() {
    send({
      type: "SET_ACTIVE_BUS_PANELS",
      busId,
    });
  }

  return (
    <>
      {currentBuses[busId].panelActive !== false && (
        <BusPanels fx={fx} busId={busId} />
      )}
      <ChannelButton
        className="fx-select"
        disabled={disabled}
        onClick={handleClick}
      >
        {disabled
          ? "No "
          : currentBuses[busId].panelActive !== false
          ? "Close"
          : "Open"}
        FX
      </ChannelButton>
      {array(2).map((_, fxId) => (
        <select
          key={fxId}
          id={`bus${busId}fx${fxId}`}
          className="fx-select"
          onChange={saveBusFx}
          value={currentBuses[busId]?.fxNames[fxId]}
        >
          <option value={"nofx"}>{`FX ${fxId + 1}`}</option>
          <option value={"reverb"}>Reverb</option>
          <option value={"delay"}>Delay</option>
          <option value={"pitchShift"}>Pitch Shift</option>
        </select>
      ))}
    </>
  );
}

export default BusFxSelect;
