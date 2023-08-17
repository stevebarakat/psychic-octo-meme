import ChannelLabel from "../ChannelLabel";
import useBusFx from "./hooks/useBusFx";
import useSaveBusFx from "./hooks/useSaveBusFx";
import BusFxSelect from "./BusFxSelect";
import Fader from "./Fader";

type Props = {
  channels: BusChannel[];
  busId: number;
};

function BusChannel({ channels, busId }: Props) {
  const { fx, meters } = useBusFx(busId, channels);
  const saveBusFx = useSaveBusFx(busId);

  return (
    <div className="flex-y gap2">
      <BusFxSelect busId={busId} fx={fx} saveBusFx={saveBusFx} />
      <div className="channel">
        <Fader busId={busId} channels={channels} meters={meters} />
        <ChannelLabel channelName={`Bus ${busId + 1}`} />
      </div>
    </div>
  );
}

export default BusChannel;
