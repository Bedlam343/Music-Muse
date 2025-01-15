import { Track } from 'src/utils/types';

const useSpotify = (accessToken: string) => {
  const searchTrack = async (trackName: string, artistName: string) => {
    const query = encodeURIComponent(`${trackName} artist:${artistName}`);
    return fetch(
      `https://api.spotify.com/v1/search?q=${query}&type=track&limit=1`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    )
      .then((response) => response.json())
      .then((data) => data.tracks.items[0] as Track);
  };

  return { searchTrack };
};

export default useSpotify;
