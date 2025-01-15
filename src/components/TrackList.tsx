import { Track } from 'src/utils/types';

type TrackListProps = {
  tracks: Track[];
};

const TrackList = ({ tracks }: TrackListProps) => {
  return (
    <div className="flex justify-center gap-[30px] max-w-[900px] flex-wrap">
      {tracks.map((track, index) => (
        <div
          key={track.id}
          style={{
            opacity: 0,
            animationDelay: `${0.1 * index}s`,
          }}
          className="animate-appear flex flex-col gap-[10px]"
        >
          <img
            className="w-[90px]"
            src="src/assets/spotify/full_logo_white.png"
          />

          <a
            href={track.external_urls.spotify}
            target="_blank"
            className="flex flex-col items-center w-[150px] gap-[5px] group"
          >
            <div className="w-[150px] h-[150px] flex justify-center items-center">
              <img
                className="h-[150px] w-[150px] group-hover:h-[145px] group-hover:w-[145px]"
                src={track.album.images[0].url}
              />
            </div>

            <div>
              <p className="text-center text-stone-300 font-bold group-hover:underline">
                {track.name}
              </p>
              <p className="text-stone-400 text-center">
                {track.artists[0].name}
              </p>
            </div>
          </a>
        </div>
      ))}
    </div>
  );
};

export default TrackList;
