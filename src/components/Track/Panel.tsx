import TrackPanel from "./TrackPanel";
import { Delay, Reverber, PitchShifter } from "./Fx";

type Props = {
  fx: TrackFx;
  fxNames: string[];
  trackId: number;
};

function Panel(fx, fxNames, trackId): Props {
  const showReverb = fxNames.some((name: string) => name === "reverb");
  const showDelay = fxNames.some((name: string) => name === "delay");
  const showPitchShift = fxNames.some((name: string) => name === "pitchShift");

  if (!showDelay && !showPitchShift && !showReverb) return;
  return (
    <TrackPanel trackId={trackId}>
      {showDelay && <Delay delay={fx.delay} trackId={trackId} />}
      {showReverb && <Reverber reverb={fx.reverb} trackId={trackId} />}
      {showPitchShift && (
        <PitchShifter pitchShift={fx.pitchShift} trackId={trackId} />
      )}
    </TrackPanel>
  );
}

export default Panel;
