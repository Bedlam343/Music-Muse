import Track from 'src/components/Track';
import { Track as TrackType } from 'src/utils/types';

type TrackListProps = {
  tracks: TrackType[];
  onLikeTrack: (trackId: string) => void;
  onUnlikeTrack: (trackId: string) => void;
};

const TrackList = ({ tracks, onLikeTrack, onUnlikeTrack }: TrackListProps) => {
  const handleIconClick = (trackId: string, liked: boolean) => {
    if (liked) {
      onUnlikeTrack(trackId);
    } else {
      onLikeTrack(trackId);
    }
  };

  if (tracks.length === 0) return null;

  return (
    <div className="flex flex-col gap-[30px]">
      <div className="px-3">
        <p className="text-2xl text-stone-300 font-semibold">
          Recommended Tracks:
        </p>
      </div>

      <div
        className="flex justify-center gap-x-[30px] gap-y-[40px]
        max-w-[900px] flex-wrap"
      >
        {tracks.map((track, index) => (
          <Track
            track={track}
            animationDelay={0.1 * index}
            onLikeIconClick={handleIconClick}
          />
        ))}
      </div>
    </div>
  );
};

export default TrackList;
