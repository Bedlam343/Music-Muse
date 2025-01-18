import { Track as TrackType } from 'src/utils/types';
import Tooltip from 'src/components/common/Tooltip';

type TrackProps = {
  track: TrackType;
  animationDelay: number;
  onLikeIconClick: (trackId: string, liked: boolean) => void;
};

const Track = ({ track, animationDelay, onLikeIconClick }: TrackProps) => {
  return (
    <div
      key={track.id}
      style={{
        opacity: 0,
        animationDelay: `${animationDelay}s`,
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

          <p className="text-stone-400 text-center">{track.artists[0].name}</p>
        </div>
      </a>

      <Tooltip
        text={
          track.likedByCurrentUser
            ? 'Remove From Liked Songs'
            : 'Add to Liked Songs'
        }
      >
        <img
          onClick={() =>
            onLikeIconClick(track.id, Boolean(track.likedByCurrentUser))
          }
          className="w-[20px] h-[20px] hover:cursor-pointer"
          src={`src/assets/spotify/${
            track.likedByCurrentUser
              ? 'like_icon_liked.png'
              : 'like_icon_like.png'
          }`}
        />
      </Tooltip>
    </div>
  );
};

export default Track;
