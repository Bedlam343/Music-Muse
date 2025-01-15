import { Track } from 'src/utils/types';

type TrackListProps = {
  tracks: Track[];
};

const TrackList = ({ tracks }: TrackListProps) => {
  return (
    <div className="flex justify-center  gap-[10px] w-[800px] flex-wrap">
      {tracks.map((track) => (
        <div key={track.id} className="flex flex-col items-center w-[150px]">
          <img
            className="h-[150px] w-[150px]"
            src={track.album.images[0].url}
          />
          <p>{track.name}</p>
          <p>{track.artists[0].name}</p>
        </div>
      ))}
    </div>
  );
};

export default TrackList;
