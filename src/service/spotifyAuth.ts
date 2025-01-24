const SPOTIFY_ENCODED_CLIENT_SECRET = import.meta.env
  .VITE_SPOTIFY_ENCODED_CLIENT_SECRET;
const SPOTIFY_CLIENT_ID = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
const SPOTIFY_REDIRECT_URI = import.meta.env.VITE_SPOTIFY_REDIRECT_URI;
const MODE = import.meta.env.MODE;

import { toast } from 'react-toastify';
import {
  SPOTIFY_AUTH_SCOPE,
  SPOTIFY_ACCOUNTS_BASE_URL,
  SPOTIFY_API_BASE_URL,
  USER_ACCESS_TOKEN,
  USER_EXPIRES_AT,
  USER_REFRESH_TOKEN,
  SPOTIFY_CODE_VERIFIER,
  CLIENT_ACCESS_TOKEN,
  CLIENT_EXPIRES_AT,
  NETLIFY_SERVERLESS_BASE_URL,
} from 'src/utils/constants';
import { generateCodeChallenge, generateCodeVerifier } from 'src/utils/helpers';
import { Parameters, Track, User } from 'src/utils/types';

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
    redirect_uri: SPOTIFY_REDIRECT_URI,
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
        redirect_uri: SPOTIFY_REDIRECT_URI,
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

    toast('Spotify Account Linked', {
      type: 'success',
      position: 'top-center',
    });
  } else {
    console.warn('No code or codeVerifier');
  }
};

export const fetchClientAccessToken = async () => {
  try {
    const clientAcessToken = localStorage.getItem(CLIENT_ACCESS_TOKEN);
    const expires = localStorage.getItem(CLIENT_EXPIRES_AT);

    // already have token and is not expired
    if (clientAcessToken && expires && Number(expires) >= Date.now()) return;

    let response;

    if (MODE === 'production') {
      response = await fetch(
        `${NETLIFY_SERVERLESS_BASE_URL}/fetchClientAccessToken`
      );
    } else {
      response = await fetch(`${SPOTIFY_ACCOUNTS_BASE_URL}/api/token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Authorization: `Basic ${SPOTIFY_ENCODED_CLIENT_SECRET}`,
        },
        body: 'grant_type=client_credentials',
      });
    }

    if (!response.ok) {
      throw new Error(
        `Error fetching client access token: ${response.statusText}`
      );
    }

    const data = await response.json();

    const { access_token, expires_in } = data;
    const expiresAt = Date.now() + expires_in * 100;

    localStorage.setItem(CLIENT_ACCESS_TOKEN, access_token);
    localStorage.setItem(CLIENT_EXPIRES_AT, expiresAt.toString());
  } catch (error) {
    console.error(error);
    return undefined;
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
