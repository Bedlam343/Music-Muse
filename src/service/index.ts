const SPOTIFY_CLIENT_ID = import.meta.env.VITE_SPOTIFY_CLIENT_ID as string;
import { REDIRECT_URI } from 'src/utils/constants';
import { generateCodeChallenge, generateCodeVerifier } from 'src/utils/helpers';
import { Parameters, Track, User } from 'src/utils/types';

export const searchTrack = async (
  trackName: string,
  artistName: string,
  accessToken: string
) => {
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

export const getTrack = async (trackId: string, accessToken: string) => {
  try {
    const response = await fetch(
      `https://api.spotify.com/v1/tracks/${trackId}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

    const data = await response.json();
    return data as Track;
  } catch (err) {
    console.error(`Song with ${trackId} not found on Spotify`, err);
    return undefined;
  }
};

export const redirectToSpotify = async (state: {
  parameters: Parameters;
  tracks: Track[];
}) => {
  const SCOPE = 'user-read-private user-read-email';
  const AUTH_URL = new URL('https://accounts.spotify.com/authorize');

  const codeVerifier = generateCodeVerifier(64);
  localStorage.setItem('spotify_code_verifier', codeVerifier);

  const codeChallenge = await generateCodeChallenge(codeVerifier);

  const params = {
    response_type: 'code',
    client_id: SPOTIFY_CLIENT_ID,
    scope: SCOPE,
    code_challenge_method: 'S256',
    code_challenge: codeChallenge,
    redirect_uri: REDIRECT_URI,
  };

  AUTH_URL.search = new URLSearchParams(params).toString();
  localStorage.setItem('state', JSON.stringify(state));
  window.location.href = AUTH_URL.toString();
};

export const handleSpotifyCallback = async () => {
  const codeVerifier = localStorage.getItem('spotify_code_verifier');
  const urlParams = new URLSearchParams(window.location.search);
  const code = urlParams.get('code');

  if (code && codeVerifier) {
    const payload = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: SPOTIFY_CLIENT_ID,
        grant_type: 'authorization_code',
        code,
        redirect_uri: REDIRECT_URI,
        code_verifier: codeVerifier,
      }),
    };

    const body = await fetch('https://accounts.spotify.com/api/token', payload);
    const response = await body.json();

    return response.access_token as string;
  } else {
    console.warn('No code or codeVerifier');
    return undefined;
  }
};

export const fetchCurrentUser = async (
  accessToken: string
): Promise<User | undefined> => {
  try {
    const response = await fetch('https://api.spotify.com/v1/me', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      return undefined;
    }

    const data = await response.json();
    return data as User;
  } catch (error) {
    console.error(error);
    return undefined;
  }
};
