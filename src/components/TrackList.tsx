import { ForwardedRef, forwardRef } from 'react';
import Track from 'src/components/Track';
import { Track as TrackType } from 'src/utils/types';

type TrackListProps = {
  tracks: TrackType[];
  onLikeTrack: (trackId: string) => void;
  onUnlikeTrack: (trackId: string) => void;
};

const TrackList = forwardRef(
  (
    { tracks, onLikeTrack, onUnlikeTrack }: TrackListProps,
    ref: ForwardedRef<HTMLDivElement>
  ) => {
    const handleIconClick = (trackId: string, liked: boolean) => {
      if (liked) {
        onUnlikeTrack(trackId);
      } else {
        onLikeTrack(trackId);
      }
    };

    if (tracks.length === 0) return null;

    return (
      <div ref={ref} className="flex flex-col gap-[30px] w-fit">
        <div className="px-[20px] flex justify-center">
          <p
            className="w-fit text-2xl text-stone-300 font-semibold 
          border-b-[2px] border-spotifyGreen"
          >
            Recommended Tracks:
          </p>
        </div>

        <div
          className="flex justify-center gap-x-[30px] gap-y-[40px]
        max-w-[900px] flex-wrap px-[20px]"
        >
          {tracks.map((track, index) => (
            <Track
              key={track.id}
              track={track}
              animationDelay={0.1 * index}
              onLikeIconClick={handleIconClick}
            />
          ))}
        </div>
      </div>
    );
  }
);

export default TrackList;
