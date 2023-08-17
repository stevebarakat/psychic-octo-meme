import { useEffect, useRef, useCallback, useState } from "react";
import { Transport as t } from "tone";
import { formatMilliseconds } from "../../utils";
import "./style.css";

type Props = {
  song: SourceSong;
};

function Clock({ song }: Props) {
  const requestRef = useRef<number | null>(null);
  const [clock, setClock] = useState(formatMilliseconds(0));

  // TODO - make this a guard in XState
  // make sure song starts at begining and stops at end
  if (song.end !== null && song.start !== null) {
    if (t.seconds < song.start) {
      t.seconds = song.start;
    }
    if (t.seconds > song.end) {
      t.stop();
      t.seconds = song.end;
    }
  }

  const animateClock = useCallback(() => {
    requestRef.current = requestAnimationFrame(animateClock);
    setClock(formatMilliseconds(t.seconds));
  }, []);

  useEffect(() => {
    requestAnimationFrame(animateClock);

    return () => {
      if (requestRef.current === null) return;
      cancelAnimationFrame(requestRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="clock">
      <div className="ghost">88:88:88</div>
      {clock}
    </div>
  );
}

export default Clock;
