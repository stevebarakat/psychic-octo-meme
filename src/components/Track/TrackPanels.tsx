import { Fragment, type ReactNode } from "react";
import { MixerMachineContext } from "@/context/MixerMachineContext";
import { CloseButton } from "@/components/Buttons";
import { Rnd as FxPanel } from "react-rnd";
import { localStorageGet } from "@/utils";

type PanelProps = {
  children: ReactNode;
  trackId: number;
};

type PanelsProps = {
  fx: Fx;
  trackId: number;
};

export function TrackPanel({ children, trackId }: PanelProps) {
  const { send } = MixerMachineContext.useActorRef();
  const panelPosition = MixerMachineContext.useSelector((state) => {
    return state.context.currentTracks[trackId].panelPosition;
  });

  const panelSize = MixerMachineContext.useSelector((state) => {
    return state.context.currentTracks[trackId].panelSize;
  });

  function handleResize(ref: HTMLElement) {
    send({
      type: "SET_TRACK_PANEL_SIZE",
      width: ref.style.width,
      trackId,
    });
  }

  function handleMove(d: { x: number; y: number }) {
    send({
      type: "SET_TRACK_PANEL_POSITON",
      x: d.x,
      y: d.y,
      trackId,
    });
  }

  function handleClick() {
    send({
      type: "SET_ACTIVE_TRACK_PANELS",
      trackId,
    });
  }

  return (
    <FxPanel
      className="fx-panel"
      position={panelPosition}
      onDragStop={(_, d) => handleMove(d)}
      size={panelSize}
      minWidth="200px"
      onResizeStop={(_, __, ref) => {
        handleResize(ref);
      }}
      cancel="input"
    >
      <CloseButton onClick={handleClick}>X</CloseButton>
      {children}
    </FxPanel>
  );
}

function TrackPanels({ fx, trackId }: PanelsProps) {
  const currentTracks = localStorageGet("currentTracks");
  const ct = currentTracks[trackId];

  const panelsEmpty = ct.fxNames.every((name: string) => name === "nofx");

  console.log("fx", fx);
  return !panelsEmpty ? (
    <TrackPanel trackId={trackId}>
      {fx.map((ef, i) => (
        <Fragment key={i}>{ef}</Fragment>
      ))}
    </TrackPanel>
  ) : null;
}

export default TrackPanels;
