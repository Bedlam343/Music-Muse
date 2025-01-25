import { ForwardedRef, forwardRef } from 'react';
import Track from 'src/components/Track';
import { Track as TrackType } from 'src/utils/types';
import Spinner from 'src/components/common/Spinner';
import Refresh from 'src/icons/Refresh';

type TrackListProps = {
  tracks: TrackType[];
  onLikeTrack: (trackId: string) => void;
  onUnlikeTrack: (trackId: string) => void;
  tracksStatus: 'fetching' | 'fetched' | 'unfetched';
  onRecommend: () => void;
};

const TrackList = forwardRef(
  (
    {
      tracks,
      onLikeTrack,
      onUnlikeTrack,
      tracksStatus,
      onRecommend,
    }: TrackListProps,
    ref: ForwardedRef<HTMLDivElement>
  ) => {
    const handleIconClick = (trackId: string, liked: boolean) => {
      if (liked) {
        onUnlikeTrack(trackId);
      } else {
        onLikeTrack(trackId);
      }
    };

    if (tracks.length === 0 && tracksStatus === 'unfetched') return null;

    const renderTrackList = () => {
      if (tracksStatus === 'fetched' || tracksStatus === 'unfetched') {
        if (tracks.length === 0 && tracksStatus === 'unfetched') {
          return (
            <div className="flex flex-col items-center gap-[10px]">
              <p className="text-red-400">Error. Could not find tracks.</p>
              <button
                onClick={onRecommend}
                className="px-2 text-sm py-1 border-[1px] rounded-lg border-stone-400 text-stone-300"
              >
                Try again
              </button>
            </div>
          );
        }
        return (
          <div className="flex flex-col items-center gap-[40px]">
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

            <div
              onClick={onRecommend}
              style={{ opacity: 0, animationDelay: `${0.1 * tracks.length}s` }}
              className="flex flex-col items-center hover:cursor-pointer animate-appear group"
            >
              <Refresh height={40} width={40} />
              <p className="text-stone-300 text-lg text-center group-hover:underline underline-offset-2">
                Refresh
              </p>
            </div>
          </div>
        );
      } else if (tracksStatus === 'fetching') {
        return (
          <div className="flex justify-center">
            <Spinner text="Searching..." />
          </div>
        );
      }

      return null;
    };

    return (
      <div ref={ref} className="flex flex-col gap-[40px] w-fit">
        <div className="px-[20px] flex justify-center">
          <p
            className="w-fit text-2xl text-stone-300 font-semibold 
          border-b-[2px] border-spotifyGreen"
          >
            Recommended Tracks:
          </p>
        </div>

        {renderTrackList()}
      </div>
    );
  }
);

export default TrackList;
