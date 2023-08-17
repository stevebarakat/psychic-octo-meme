import { useEffect, useRef } from "react";
import { Channel, Player, Transport as t } from "tone";

type Props = {
  tracks: SourceTrack[];
};

function useTracks({ tracks }: Props) {
  const channels = useRef<Channel[] | []>([]);
  const players = useRef<Player[] | []>([]);

  useEffect(() => {
    tracks.forEach((track) => {
      channels.current = [...channels.current, new Channel({ volume: 0 })];
      players.current = [...players.current, new Player(track.path)];
    });

    players.current?.forEach((player, i) => {
      channels.current &&
        player.connect(channels.current[i]).sync().start("+0.5");
    });

    return () => {
      t.stop();
      players.current?.forEach((player, i) => {
        player?.dispose();
        channels.current && channels.current[i].dispose();
      });
      players.current = [];
      channels.current = [];
    };
  }, [tracks]);

  return { channels: channels.current };
}

export default useTracks;
