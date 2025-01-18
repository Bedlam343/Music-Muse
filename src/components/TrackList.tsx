import { Track } from 'src/utils/types';
import Tooltip from 'src/components/common/Tooltip';

type TrackListProps = {
  tracks: Track[];
};

const TrackList = ({ tracks }: TrackListProps) => {
  const handleLikeClick = (trackId: string) => {};

  if (tracks.length === 0) return null;

  return (
    <div className="flex flex-col gap-[30px]">
      <div className="px-3">
        <p className="text-2xl text-stone-300 font-semibold">
          Recommended Tracks:
        </p>
      </div>

      <div className="flex justify-center gap-[30px] max-w-[900px] flex-wrap">
        {tracks.map((track, index) => (
          <div
            key={track.id}
            style={{
              opacity: 0,
              animationDelay: `${0.1 * index}s`,
            }}
            className="animate-appear flex flex-col items-center gap-[20px]"
          >
            <a
              href={track.external_urls.spotify}
              target="_blank"
              className="flex flex-col items-center w-[150px] gap-[10px] group"
            >
              <div className="flex w-full justify-between">
                <img
                  className="w-[90px]"
                  src="src/assets/spotify/full_logo_white.png"
                />

                <div className="flex justify-end items-end w-full invisible group-hover:visible">
                  <img
                    src="src/assets/arrow_outward.png"
                    className="w-[20px] h-[20px]"
                  />
                </div>
              </div>

              <div className="w-[150px] h-[150px] flex justify-center items-center">
                <img
                  className="transition duration-300 tranform ease-in-out h-[150px] w-[150px] group-hover:scale-95"
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

            <Tooltip text="Add to Liked Songs">
              <img
                onClick={() => handleLikeClick(track.id)}
                className="w-[20px] h-[20px] hover:cursor-pointer"
                src="src/assets/spotify/like_icon_like.png"
              />
            </Tooltip>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TrackList;
