type Props = {
  song: SourceSong;
};

function SongInfo({ song }: Props) {
  return (
    <div>
      {song.artist} - {song.title}
    </div>
  );
}

export default SongInfo;
