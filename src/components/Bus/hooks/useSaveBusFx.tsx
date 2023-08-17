import { MixerMachineContext } from "@/context/MixerMachineContext";
import { localStorageGet, localStorageSet } from "@/utils";

function useSaveBusFx(busId: number) {
  const { send } = MixerMachineContext.useActorRef();
  const busFxNames = MixerMachineContext.useSelector(
    (state) => state.context.currentBuses[busId].fxNames
  );

  function saveBusFx(e: React.FormEvent<HTMLSelectElement>) {
    const currentBuses = localStorageGet("currentBuses");

    const sid = e.currentTarget.id.at(-1) ?? 0;
    const id = parseInt(sid.toString(), 10);
    busFxNames[busId] = e.currentTarget.value;
    send({
      type: "SET_BUS_FX_NAMES",
      busId,
      value: [...busFxNames],
    });

    currentBuses[busId].fxNames[id] = e.currentTarget.value;
    localStorageSet("currentBuses", currentBuses);
  }

  return saveBusFx;
}

export default useSaveBusFx;
