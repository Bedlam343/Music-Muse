import { SPOTIFY_API_BASE_URL } from 'src/utils/constants';
import { Track } from 'src/utils/types';

export const searchTrack = async (
  trackName: string,
  artistName: string,
  accessToken: string
) => {
  const query = encodeURIComponent(`${trackName} artist:${artistName}`);

  try {
    const response = await fetch(
      `${SPOTIFY_API_BASE_URL}/search?q=${query}&type=track&limit=3`,
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

export const getTrack = async (trackId: string, accessToken: string) => {
  try {
    const response = await fetch(`${SPOTIFY_API_BASE_URL}/tracks/${trackId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

    const data = await response.json();
    return data as Track;
  } catch (err) {
    console.error(`Song with ${trackId} not found on Spotify`, err);
    return undefined;
  }
};

export const saveTrack = async (trackId: string, userAccessToken: string) => {
  if (!userAccessToken) {
    console.error('No user access token found!');
    return false;
  }

  try {
    const response = await fetch(`${SPOTIFY_API_BASE_URL}/me/tracks`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${userAccessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ids: [trackId] }),
    });

    if (!response.ok) {
      throw new Error(`Error saving track: ${response.statusText}`);
    }

    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
};

export const removeTrack = async (trackId: string, userAccessToken: string) => {
  if (!userAccessToken) {
    console.error('No user access token found!');
    return false;
  }

  try {
    const response = await fetch(`${SPOTIFY_API_BASE_URL}/me/tracks`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${userAccessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ids: [trackId] }),
    });

    if (!response.ok) {
      throw new Error(`Error saving track: ${response.statusText}`);
    }

    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
};

export const getSongsLikedStatuses = async (
  trackIds: string[],
  userAccessToken: string
) => {
  if (!userAccessToken) {
    console.error('No user access token!');
    return [];
  }

  try {
    const idsParam = trackIds.join(',');
    const response = await fetch(
      `${SPOTIFY_API_BASE_URL}/me/tracks/contains?ids=${idsParam}`,
      {
        headers: {
          Authorization: `Bearer ${userAccessToken}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Error checking liked status: ${response.statusText}`);
    }

    const data = await response.json();
    return data as boolean[];
  } catch (error) {
    console.error(error);
    return [];
  }
};
