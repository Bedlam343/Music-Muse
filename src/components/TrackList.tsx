import { Track } from 'src/utils/types';

type TrackListProps = {
  tracks: Track[];
};

const TrackList = ({ tracks }: TrackListProps) => {
  return (
    <div className="flex justify-center  gap-[10px] max-w-[800px] flex-wrap">
      {tracks.map((track, index) => (
        <div
          key={track.id}
          style={{
            opacity: 0,
            animationDelay: `${0.1 * index}s`,
          }}
          className={`flex flex-col items-center w-[150px] animate-appear`}
        >
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
