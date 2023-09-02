import { useEffect } from "react";
import { Oscillator, Transport as t } from "tone";

function useMetronome() {
  useEffect(() => {
    const osc = new Oscillator({
      type: "sawtooth",
      frequency: 800,
      volume: -26,
    }).toDestination();
    t.scheduleRepeat((time) => {
      osc.start(time).stop(time + 0.1);
    }, "4n");
  }, []);
  return null;
}

export default useMetronome;
