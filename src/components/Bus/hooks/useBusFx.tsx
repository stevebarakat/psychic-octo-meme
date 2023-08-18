import { useRef } from "react";
import { localStorageGet } from "@/utils";
import {
  Reverb,
  FeedbackDelay,
  PitchShift,
  Gain,
  Meter,
  InputNode,
} from "tone";
import { Reverber, Delay, PitchShifter, NoFx } from "../Fx";
import { array } from "@/utils";

type BusFx = {
  nofx: Gain | null;
  reverb: Reverb | null;
  delay: FeedbackDelay | null;
  pitchShift: PitchShift | null;
};

function useBusFx(busId: number, channels: BusChannel[]) {
  const currentBuses = localStorageGet("currentBuses");
  const cb = currentBuses[busId];
  const meters = useRef([new Meter(), new Meter()]);

  const busFx: BusFx = {
    nofx: new Gain(0),
    reverb: null,
    delay: null,
    pitchShift: null,
  };

  const fxComponents = useRef({
    1: <NoFx nofx={busFx.nofx} />,
    2: <NoFx nofx={busFx.nofx} />,
  });

  const fx = (() => {
    const currentFx = cb.fxNames ?? null;

    array(2).forEach((_, fxId) => {
      switch (currentFx[fxId]) {
        case "nofx":
          busFx.nofx = new Gain(0);

          fxComponents.current = {
            ...fxComponents.current,
            [`${fxId + 1}`]: <NoFx nofx={busFx.nofx} />,
          };

          break;
        case "reverb":
          busFx.reverb = new Reverb({
            wet: cb.reverbMix[fxId],
            preDelay: cb.reverbPreDelay[fxId],
            decay: cb.reverbDecay[fxId],
          }).toDestination();

          fxComponents.current = {
            ...fxComponents.current,
            [fxId + 1]: (
              <Reverber reverb={busFx.reverb} busId={busId} fxId={fxId} />
            ),
          };

          break;
        case "delay":
          busFx.delay = new FeedbackDelay({
            wet: cb.delayMix[fxId],
            delayTime: cb.delayTime[fxId],
            feedback: cb.delayFeedback[fxId],
          }).toDestination();

          fxComponents.current = {
            ...fxComponents.current,
            [fxId + 1]: <Delay delay={busFx.delay} busId={busId} fxId={fxId} />,
          };

          break;
        case "pitchShift":
          busFx.pitchShift?.disconnect();
          busFx.pitchShift = new PitchShift({
            wet: cb.pitchShiftMix[fxId],
            pitch: cb.pitchShiftPitch[fxId],
          }).toDestination();

          fxComponents.current = {
            ...fxComponents.current,
            [fxId + 1]: (
              <PitchShifter
                pitchShift={busFx.pitchShift}
                busId={busId}
                fxId={fxId}
              />
            ),
          };

          break;
        default:
          break;
      }
    });
    const fxProps: InputNode[] = Object.values(fxComponents.current).map(
      (fx) => fx.props
    );
    const fxNodes = fxProps.map((prop) => Object.values(prop)[0]);

    channels[busId]
      .disconnect()
      .toDestination()
      .connect(meters.current[busId])
      .chain(fxNodes[0], fxNodes[1]);
    return fxComponents.current;
  })();

  return { fx, meters: meters };
}

export default useBusFx;
