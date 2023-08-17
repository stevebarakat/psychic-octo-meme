import { MixerMachineContext } from "@/context/MixerMachineContext";
import CheckBox from "../CheckBox";

type Props = {
  trackId: number;
  channels: Channel[];
  busChannels: BusChannel[];
};

function Sends({ trackId, channels, busChannels }: Props) {
  const [, send] = MixerMachineContext.useActor();
  const sends = MixerMachineContext.useSelector((state) => {
    return state.context.currentTracks[trackId].sends;
  });

  function toggleSends(e: React.FormEvent<HTMLInputElement>): void {
    send({
      type: "TOGGLE_SENDS",
      trackId,
      channels,
      busChannels,
      target: e.currentTarget,
    });
  }

  return (
    <div className="channel-checkbox">
      {busChannels.map((_, busId) => (
        <CheckBox
          id={`track${trackId}-send${busId}`}
          checked={sends[busId]}
          onChange={toggleSends}
          key={busId}
        >
          {busId + 1}
        </CheckBox>
      ))}
    </div>
  );
}

export default Sends;
