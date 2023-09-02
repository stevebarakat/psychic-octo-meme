import { useRef, useEffect } from "react";
import { ToneEvent, Transport as t } from "tone";
import { MixerMachineContext } from "@/context/MixerMachineContext";
import { useLiveQuery } from "dexie-react-hooks";
import { DexieDb, db } from "@/db";

type Props = {
  trackId: number;
  channels: Channel[];
  param: "volume" | "pan" | "soloMute";
};

type SoloMuteType = {
  solo: boolean;
  mute: boolean;
};

function useRead({ trackId, channels, param }: Props) {
  const { send } = MixerMachineContext.useActorRef();

  const type = `SET_TRACK_${param.toUpperCase()}`;

  const readEvent = useRef<ToneEvent | null>(null);
  const playbackMode = MixerMachineContext.useSelector(
    (state) => state.context.currentTracks[trackId][`${param}Mode`]
  );

  let queryData = [];
  const paramData = useLiveQuery(async () => {
    queryData = await db[`${param}Data`]
      .where("id")
      .equals(`${param}Data${trackId}`)
      .toArray();
    return queryData[0];
  });

  // !!! --- READ --- !!! //
  useEffect(() => {
    if (playbackMode !== "read") return;

    readEvent.current = new ToneEvent(() => {
      function setParam(
        trackId: number,
        data: {
          time: number;
          value: number | string | SoloMuteType;
        }
      ) {
        t.schedule(() => {
          if (playbackMode !== "read") return;

          send({
            type,
            trackId,
            value: data.value,
          });
        }, data.time);
      }

      for (const value of paramData!.data.values()) {
        setParam(value.id, value);
      }
    }, 1).start("+0.1");

    return () => {
      readEvent.current?.dispose();
      // t.cancel();
    };
  }, [send, trackId, paramData, param, type, channels, playbackMode]);

  return null;
}

export default useRead;
