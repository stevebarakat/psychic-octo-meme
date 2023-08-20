import { useRef, useEffect } from "react";
import { ToneEvent, Transport as t } from "tone";
import { MixerMachineContext } from "@/context/MixerMachineContext";
import { useLiveQuery } from "dexie-react-hooks";
import { DexieDb, db } from "@/db";

type Props = { trackId: number; channels: Channel[]; param: string };

function useRead({ trackId, channels, param }: Props) {
  const { send } = MixerMachineContext.useActorRef();

  const readEvent = useRef<ToneEvent | null>(null);
  const playbackMode = MixerMachineContext.useSelector(
    (state) =>
      state.context.currentTracks[trackId][
        `${param}Mode` as keyof TrackSettings
      ]
  );

  let queryData = [];
  const paramData = useLiveQuery(async () => {
    queryData = await db[`${param}Data` as keyof DexieDb]
      .where("id")
      .equals(`${param}Data${trackId}`)
      .toArray();
    return queryData[0];
  });

  // !!! --- READ --- !!! //
  useEffect(() => {
    if (playbackMode !== "read") return;
    console.log(`SET_TRACK_${param.toUpperCase()}`);
    const type = `SET_TRACK_${param.toUpperCase()}`;
    readEvent.current = new ToneEvent(() => {
      function setParam(
        trackId: number,
        data: {
          time: number;
          value: number | string | boolean;
          value2?: number | string | boolean;
        }
      ) {
        t.schedule(() => {
          // if (playbackMode !== "read") return;

          send({
            type,
            value: data.value,
            value2: data.value2,
            channels,
            trackId,
          });
        }, data.time);
      }

      for (const value of paramData!.data.values()) {
        setParam(value.id, value);
      }
    }, 1).start("+0.1");

    return () => {
      readEvent.current?.dispose();
      t.cancel();
    };
  }, [send, trackId, paramData, param, channels, playbackMode]);

  return null;
}

export default useRead;
