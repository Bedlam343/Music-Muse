import { ChangeEvent, useEffect, useState } from 'react';
import {
  Parameters,
  Genre,
  TimeOfDay,
  Mood,
  Activity,
  Track,
} from 'src/utils/types';
import TrackList from './components/TrackList';

const SPOTIFY_CLIENT_ID = import.meta.env.VITE_SPOTIFY_CLIENT_ID as string;
const SPOTIFY_CLIENT_SECRET = import.meta.env
  .VITE_SPOTIFY_CLIENT_SECRET as string;

const DEFAULT_PARAMETERS: Parameters = {
  genre: Genre['Hip-Hop'],
  timeOfDay: TimeOfDay.Morning,
  mood: Mood.Energetic,
  activity: Activity.Workout,
} as const;

const DUMMY_LIST = [
  'Softly,Karan Aujla',
  'City of Stars,Logic',
  'No Face,Drake',
  'Sorry Not Sorry,Bryson Tiller',
  'Surround Sound,JID',
  'Pistolero,MGK',
  'Not Like Us,Kendrick Lamar',
  'Family Matters,Drake',
  'Stealth Mode,J. Cole',
  'GOD,Kendrick Lamar',
];

function App() {
  const [spotifyAccessToken, setSpotifyAccessToken] = useState<string>('');
  const [parameters, setParameters] = useState<Parameters>({
    ...DEFAULT_PARAMETERS,
  });
  const [tracks, setTracks] = useState<Track[]>([]);

  useEffect(() => {
    const getAccessToken = async () => {
      const response = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Authorization: `Basic ${btoa(
            `${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`
          )}`,
        },
        body: 'grant_type=client_credentials',
      });

      const data = await response.json();
      setSpotifyAccessToken(data.access_token as string);
    };

    if (!spotifyAccessToken) getAccessToken();
  }, [spotifyAccessToken]);

  const searchTrack = async (trackName: string, artistName: string) => {
    const query = encodeURIComponent(`${trackName} artist:${artistName}`);
    return fetch(
      `https://api.spotify.com/v1/search?q=${query}&type=track&limit=1`,
      {
        headers: {
          Authorization: `Bearer ${spotifyAccessToken}`,
        },
      }
    )
      .then((response) => response.json())
      .then((data) => data.tracks.items[0] as Track);
  };

  const handleParameterChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const parameter = event.target.id as keyof Parameters;
    setParameters((prevParameters) => ({
      ...prevParameters,
      [parameter]: event.target.value,
    }));
  };

  const handleRecommend = async () => {
    const promises: Promise<Track>[] = [];
    DUMMY_LIST.forEach((track) => {
      const [trackName, artist] = track.split(',');
      promises.push(searchTrack(trackName, artist));
    });

    const tracks = await Promise.all(promises);
    setTracks(tracks);
  };

  return (
    <div className="py-[10px] flex flex-col items-center">
      <p className="text-4xl text-center">Music Muse</p>

      <div className="mt-[40px] flex flex-col gap-[35px] mb-[50px]">
        <div className="flex flex-col gap-[20px]">
          <select
            id="genre"
            value={parameters.genre}
            onChange={handleParameterChange}
          >
            {Object.keys(Genre).map((genre) => (
              <option key={genre}>{genre}</option>
            ))}
          </select>
          <select
            id="timeOfDay"
            value={parameters.timeOfDay}
            onChange={handleParameterChange}
          >
            {Object.keys(TimeOfDay).map((timeOfDay) => (
              <option key={timeOfDay}>{timeOfDay}</option>
            ))}
          </select>
          <select
            id="mood"
            value={parameters.mood}
            onChange={handleParameterChange}
          >
            {Object.keys(Mood).map((mood) => (
              <option key={mood}>{mood}</option>
            ))}
          </select>
          <select
            id="activity"
            value={parameters.activity}
            onChange={handleParameterChange}
          >
            {Object.keys(Activity).map((activity) => (
              <option key={activity}>{activity}</option>
            ))}
          </select>
        </div>

        <button
          onClick={handleRecommend}
          className="hover:cursor-pointer border-2 border-black rounded-md px-2 py-1"
        >
          Recommend
        </button>
      </div>

      <TrackList tracks={tracks} />
    </div>
  );
}

export default App;
