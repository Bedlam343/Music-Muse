import { Context } from '@netlify/functions';

export default async (request: Request, context: Context) => {
  const SPOTIFY_CLIENT_ID = process.env.SPOTIFY_CLIENT_ID as string;
  const SPOTIFY_CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET as string;
  const SPOTIFY_ACCOUNTS_BASE_URL = process.env
    .SPOTIFY_ACCOUNTS_BASE_URL as string;

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

    const body = await response.json();

    return new Response(JSON.stringify(body));
  } catch (error) {
    console.error(error);
    return new Response(error);
  }
};
