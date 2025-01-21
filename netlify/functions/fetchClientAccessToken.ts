exports.handler = async () => {
  const SPOTIFY_CLIENT_ID = process.env.CLIENT_ID as string;
  const SPOTIFY_CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET as string;
  const SPOTIFY_ACCOUNTS_BASE_URL = process.env
    .SPOTIFY_ACCOUNTS_BASE_URL as string;

  console.log('fetchClientAccessToken serverless function');

  return fetch(`${SPOTIFY_ACCOUNTS_BASE_URL}/api/token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: `Basic ${btoa(
        `${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`
      )}`,
    },
    body: 'grant_type=client_credentials',
  });
};
