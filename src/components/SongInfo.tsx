type Props = {
  song: SourceSong;
};

function SongInfo({ song }: Props) {
  return (
    <h2>
      {song.artist} - {song.title}
    </h2>
  );
}

export default SongInfo;
