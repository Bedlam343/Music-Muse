const SPOTIFY_CLIENT_ID = import.meta.env.VITE_SPOTIFY_CLIENT_ID as string;
const SPOTIFY_CLIENT_SECRET = import.meta.env
  .VITE_SPOTIFY_CLIENT_SECRET as string;

import {
  REDIRECT_URI,
  SPOTIFY_AUTH_SCOPE,
  SPOTIFY_ACCOUNTS_BASE_URL,
  SPOTIFY_API_BASE_URL,
  CLIENT_ACCESS_TOKEN,
  CLIENT_EXPIRES_AT,
  USER_ACCESS_TOKEN,
  USER_EXPIRES_AT,
  USER_REFRESH_TOKEN,
  SPOTIFY_CODE_VERIFIER,
} from 'src/utils/constants';
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

export const redirectToSpotify = async (state: {
  parameters: Parameters;
  tracks: Track[];
}) => {
  const AUTH_URL = new URL(`${SPOTIFY_ACCOUNTS_BASE_URL}/authorize`);

  const codeVerifier = generateCodeVerifier(64);
  localStorage.setItem(SPOTIFY_CODE_VERIFIER, codeVerifier);
  console.log('setting code verifier');

  const codeChallenge = await generateCodeChallenge(codeVerifier);

  const params = {
    response_type: 'code',
    client_id: SPOTIFY_CLIENT_ID,
    scope: SPOTIFY_AUTH_SCOPE,
    code_challenge_method: 'S256',
    code_challenge: codeChallenge,
    redirect_uri: REDIRECT_URI,
  };

  AUTH_URL.search = new URLSearchParams(params).toString();
  localStorage.setItem('state', JSON.stringify(state));
  window.location.href = AUTH_URL.toString();
};

export const getRefreshUserAccessToken = async (refreshToken: string) => {
  const url = `${SPOTIFY_ACCOUNTS_BASE_URL}/api/token`;

  const payload = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
      client_id: SPOTIFY_CLIENT_ID,
    }),
  };
  const response = await fetch(url, payload);
  const data = await response.json();
  const { access_token, refresh_token, expires_in } = data;

  localStorage.setItem(USER_ACCESS_TOKEN, access_token);
  if (refresh_token) {
    localStorage.setItem(USER_REFRESH_TOKEN, refresh_token);
  }

  const expiresAt = Date.now() + expires_in * 100;
  localStorage.setItem(USER_EXPIRES_AT, expiresAt.toString());
};

export const handleSpotifyCallback = async () => {
  const userAccessToken = localStorage.getItem(USER_ACCESS_TOKEN);
  if (userAccessToken && userAccessToken !== 'undefined') return;

  const codeVerifier = localStorage.getItem(SPOTIFY_CODE_VERIFIER);
  // remove it right away, so won't fire second time due to react strict mode
  localStorage.removeItem(SPOTIFY_CODE_VERIFIER);

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

    const response = await fetch(
      `${SPOTIFY_ACCOUNTS_BASE_URL}/api/token`,
      payload
    );
    const data = await response.json();

    const { access_token, refresh_token, expires_in } = data;
    localStorage.setItem(USER_ACCESS_TOKEN, access_token);
    localStorage.setItem(USER_REFRESH_TOKEN, refresh_token);

    const expiresAt = Date.now() + expires_in * 100;
    localStorage.setItem(USER_EXPIRES_AT, expiresAt.toString());
  } else {
    console.warn('No code or codeVerifier');
  }
};

export const fetchClientAccessToken = async () => {
  try {
    const response = await fetch(`${SPOTIFY_ACCOUNTS_BASE_URL}/api/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Basic ${btoa(
          `${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`
        )}`,
      },
      body: 'grant_type=client_credentials',
    });

    if (!response.ok) {
      throw new Error(
        `Error fetching client access token: ${response.statusText}`
      );
    }

    const data = await response.json();

    const { access_token, expires_in } = data;
    localStorage.setItem(CLIENT_ACCESS_TOKEN, access_token);

    const expiresAt = Date.now() + expires_in * 100;
    localStorage.setItem(CLIENT_EXPIRES_AT, expiresAt.toString());
  } catch (error) {
    console.error(error);
  }
};

export const fetchCurrentUser = async (
  accessToken: string
): Promise<User | undefined> => {
  try {
    const response = await fetch(`${SPOTIFY_API_BASE_URL}/me`, {
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
