import { useEffect, useRef } from "react";
import { localStorageGet } from "@/utils";
import {
  Reverb,
  FeedbackDelay,
  PitchShift,
  Gain,
  Destination,
  InputNode,
} from "tone";
import { Reverber, Delay, PitchShifter, NoFx } from "@/components/Track/Fx";
import { array } from "@/utils";

function useTrackFx(trackId: number, channel: Channel, trackFx: TrackFx) {
  const currentTracks = localStorageGet("currentTracks");
  const ct = currentTracks[trackId];
  const fx = useRef<any>();

  const fxComponents = useRef({
    1: <NoFx nofx={trackFx.nofx} />,
    2: <NoFx nofx={trackFx.nofx} />,
  });

  useEffect(() => {
    fx.current = (() => {
      const currentFx = ct.fxNames ?? null;

      array(2).forEach((_, fxId) => {
        switch (currentFx[fxId]) {
          case "nofx":
            trackFx.nofx = new Gain();

            fxComponents.current = {
              ...fxComponents.current,
              [`${fxId + 1}`]: <NoFx nofx={trackFx.nofx} />,
            };

            break;
          case "reverb":
            trackFx.reverb = new Reverb({
              wet: ct.reverbMix[fxId],
              preDelay: ct.reverbPreDelay[fxId],
              decay: ct.reverbDecay[fxId],
            });

            fxComponents.current = {
              ...fxComponents.current,
              [`${fxId + 1}`]: (
                <Reverber
                  reverb={trackFx.reverb}
                  trackId={trackId}
                  fxId={fxId}
                />
              ),
            };

            break;
          case "delay":
            trackFx.delay = new FeedbackDelay({
              wet: ct.delayMix[fxId],
              delayTime: ct.delayTime[fxId],
              feedback: ct.delayFeedback[fxId],
            });

            fxComponents.current = {
              ...fxComponents.current,
              [`${fxId + 1}`]: (
                <Delay delay={trackFx.delay} trackId={trackId} fxId={fxId} />
              ),
            };

            break;
          case "pitchShift":
            trackFx.pitchShift = new PitchShift({
              wet: ct.pitchShiftSettings.pitchShiftMix[fxId],
              pitch: ct.pitchShiftSettings.pitchShiftPitch[fxId],
            });

            fxComponents.current = {
              ...fxComponents.current,
              [`${fxId + 1}`]: (
                <PitchShifter
                  pitchShift={trackFx.pitchShift}
                  trackId={trackId}
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
      channel.disconnect();
      channel.chain(fxNodes[0], fxNodes[1], Destination).toDestination();
    })();

    // return () => {
    //   const fxProps: InputNode[] = Object.values(fxComponents.current).map(
    //     (fx) => fx.props
    //   );
    //   const fxNodes = fxProps.map((prop) => Object.values(prop)[0]);
    //   fxNodes[0].dispose();
    //   fxNodes[1].dispose();
    // };
  }, [channel, ct, trackFx, trackId]);

  console.log("fxComponents", fxComponents.current);
  console.log("fx", fx.current);
  return fx.current;
}

export default useTrackFx;
