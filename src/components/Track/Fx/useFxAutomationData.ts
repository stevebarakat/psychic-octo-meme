import { MixerMachineContext } from "@/context/MixerMachineContext";
import { useEffect, useCallback } from "react";
import { Transport as t } from "tone";
import useWrite from "@/hooks/useWrite";
import { useLiveQuery } from "dexie-react-hooks";
import { db } from "@/db";

type Props = { trackId: number; fxId: number; fxNode: TrackFx };

type ReadProps = {
  trackId: number;
  fxId: number;
  fxNode: TrackFx;
};

function useFxAutomationData({ trackId, fxId, fxNode }: Props) {
  useWrite({
    id: trackId,
    fxId,
    fxParam: "reverb",
    value: {
      playbackMode: "static",
      reverbBypass: [reverbBypass],
      reverbMix: [reverbMix],
      reverbPreDelay: [reverbPreDelay],
      reverbDecay: [reverbDecay],
    },
  });

  useRead({ fxNode, trackId, fxId });
  return null;
}

const data = new Map<number, object>();

// !!! --- READ --- !!! //
function useRead({ fxNode, trackId, fxId }: ReadProps) {
  const { send } = MixerMachineContext.useActorRef();
  const playbackMode = MixerMachineContext.useSelector(
    (state) => state.context.currentTracks[trackId].reverbSettings.playbackMode
  );

  const setParam = useCallback(
    (
      trackId: number,
      data: {
        time: number;
        value: ReverbSettings;
      }
    ) => {
      t.schedule(() => {
        if (playbackMode !== "read") return;

        send({
          type: "SET_TRACK_REVERB_MIX",
          value: data.value.reverbMix[fxId],
          reverb: fxNode!,
          trackId,
          fxId,
        });

        send({
          type: "SET_TRACK_REVERB_PREDELAY",
          value: data.value.reverbPreDelay[fxId],
          reverb: fxNode!,
          trackId,
          fxId,
        });

        send({
          type: "SET_TRACK_REVERB_DECAY",
          value: data.value.reverbDecay[fxId],
          reverb: fxNode!,
          trackId,
          fxId,
        });
      }, data.time);
    },
    [send, playbackMode]
  );

  let queryData = [];
  const reverbData = useLiveQuery(async () => {
    queryData = await db.reverbData
      .where("id")
      .equals(`reverbData${trackId}`)
      .toArray();
    return queryData[0];
  });

  useEffect(() => {
    if (playbackMode !== "read" || !reverbData) return;
    for (const value of reverbData.data.values()) {
      setParam(value.id, value);
    }
  }, [reverbData, setParam, playbackMode]);

  return null;
}

export default useFxAutomationData;
