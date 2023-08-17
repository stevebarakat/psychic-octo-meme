import type { ReactNode } from "react";
import { MixerMachineContext } from "@/context/MixerMachineContext";
import CloseButton from "@/components/Buttons/CloseButton";
import { Rnd as FxPanel } from "react-rnd";
import { localStorageGet } from "@/utils";

type PanelProps = {
  children: ReactNode;
  busId: number;
};

type PanelsProps = {
  fx: Fx;
  busId: number;
};

function BusPanel({ children, busId }: PanelProps) {
  const { send } = MixerMachineContext.useActorRef();
  const panelPosition = MixerMachineContext.useSelector((state) => {
    return state.context.currentBuses[busId].panelPosition;
  });

  const panelSize = MixerMachineContext.useSelector((state) => {
    return state.context.currentBuses[busId].panelSize;
  });

  function handleResize(ref: HTMLElement) {
    send({
      type: "SET_BUS_PANEL_SIZE",
      width: ref.style.width,
      busId,
    });
  }

  function handleMove(d: { x: number; y: number }) {
    send({
      type: "SET_BUS_PANEL_POSITON",
      x: d.x,
      y: d.y,
      busId,
    });
  }

  function handleClick() {
    send({
      type: "SET_ACTIVE_BUS_PANELS",
      busId,
    });
  }

  return (
    <FxPanel
      className="fx-panel"
      position={panelPosition}
      onDragStop={(_, d) => handleMove(d)}
      size={panelSize}
      minWidth="200px"
      onResizeStop={(_, __, ref) => handleResize(ref)}
      cancel="input"
    >
      <CloseButton onClick={handleClick}>X</CloseButton>
      {children}
    </FxPanel>
  );
}

function BusPanels({ fx, busId }: PanelsProps) {
  const currentBuses = localStorageGet("currentBuses");
  const cb = currentBuses[busId];

  const panelsEmpty = cb.fxNames.every((name: string) => name === "nofx");

  return !panelsEmpty ? (
    <BusPanel busId={busId}>
      {fx["1"]}
      {fx["2"]}
    </BusPanel>
  ) : null;
}

export default BusPanels;
