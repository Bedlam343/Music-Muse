import { Parameters, Genre, TimeOfDay, Mood, Activity } from 'src/utils/types';

export const REDIRECT_URI = 'http://localhost:5173';
export const SPOTIFY_ACCOUNTS_BASE_URL = 'https://accounts.spotify.com';
export const SPOTIFY_API_BASE_URL = 'https://api.spotify.com/v1';
export const SPOTIFY_AUTH_SCOPE =
  'playlist-read-private user-library-modify user-library-read user-read-private user-read-email';

export const CLIENT_ACCESS_TOKEN = 'client_access_token';
export const CLIENT_EXPIRES_AT = 'client_expires_at';
export const USER_ACCESS_TOKEN = 'user_access_token';
export const USER_EXPIRES_AT = 'user_expires_at';
export const USER_REFRESH_TOKEN = 'user_refresh_token';
export const SPOTIFY_CODE_VERIFIER = 'spotify_code_verifier';

export const DEFAULT_PARAMETERS: Parameters = {
  genre: Genre['Hip-Hop'],
  timeOfDay: TimeOfDay.Morning,
  mood: Mood.Energetic,
  activity: Activity.Workout,
} as const;

export const DUMMY_RECOMMENDATIONS = [
  'Softly,Karan Aujla',
  'City Of Stars,Logic',
  'No Face,Drake',
  'Sorry Not Sorry,Bryson Tiller',
  'Surround Sound,JID',
  'El Pistolero,mgk',
  'Not Like Us,Kendrick Lamar',
  'Family Matters,Drake',
  'Stealth Mode,J. Cole',
  'GOD,Kendrick Lamar',
];
