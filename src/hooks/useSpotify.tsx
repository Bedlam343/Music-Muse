import { Track } from 'src/utils/types';

const useSpotify = (accessToken: string) => {
  const searchTrack = async (trackName: string, artistName: string) => {
    const query = encodeURIComponent(`${trackName} artist:${artistName}`);

    try {
      const response = await fetch(
        `https://api.spotify.com/v1/search?q=${query}&type=track&limit=3`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      const data = await response.json();
      return (data.tracks.items as Track[]).find((track) => {
        return (
          track.name.includes(trackName) &&
          track.artists.find((artist) => artist.name === artistName)
        );
      });
    } catch (err) {
      console.error(err);
      return undefined;
    }
  };

  const getTrack = async (trackId: string) => {
    try {
      const response = await fetch(
        `https://api.spotify.com/v1/tracks/${trackId}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (!response.ok)
        throw new Error(`HTTP error! Status: ${response.status}`);

      const data = await response.json();
      return data as Track;
    } catch (err) {
      console.error(`Song with ${trackId} not found on Spotify`, err);
      return undefined;
    }
  };

  return { searchTrack, getTrack };
};

export default useSpotify;
