import { ChangeEvent, useEffect, useState } from 'react';
import {
  Parameters,
  Genre,
  TimeOfDay,
  Mood,
  Activity,
  Track,
} from 'src/utils/types';
import TrackList from 'src/components/TrackList';
import {
  searchTrack,
  handleSpotifyCallback,
  redirectToSpotify,
} from 'src/service';
import Link from 'src/icons/Link';
import Tooltip from 'src/components/common/Tooltip';

window.onload = handleSpotifyCallback;

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

function App() {
  const [accessTokens, setAccessTokens] = useState({
    client: '',
    user: '',
  });
  const [parameters, setParameters] = useState<Parameters>({
    ...DEFAULT_PARAMETERS,
  });
  const [tracks, setTracks] = useState<Track[]>([]);

  useEffect(() => {
    const getClientAccessToken = async () => {
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
      setAccessTokens((prevTokens) => ({
        ...prevTokens,
        client: data.access_token as string,
      }));
    };

    getClientAccessToken();
  }, []);

  // restore state atfer redirect
  useEffect(() => {
    const stateStr = localStorage.getItem('state');
    if (!stateStr) return;

    const state: { parameters: Parameters; tracks: Track[] } =
      JSON.parse(stateStr);
    setTracks(state.tracks);
    setParameters(state.parameters);

    localStorage.removeItem('state');
    localStorage.removeItem('spotify_code_verifier');
  }, []);

  const handleParameterChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const parameter = event.target.id as keyof Parameters;
    setParameters((prevParameters) => ({
      ...prevParameters,
      [parameter]: event.target.value,
    }));
  };

  const handleRecommend = async () => {
    if (!accessTokens.client) return;

    const promises = DUMMY_LIST.map((entry) => {
      const [trackname, artistname] = entry.split(',');
      return searchTrack(trackname, artistname, accessTokens.client);
    });

    const newTracks = await Promise.all(promises);
    setTracks(newTracks.filter((track) => Boolean(track)) as Track[]);
  };

  const handleSpotifyConnect = () => {
    redirectToSpotify({ parameters, tracks });
  };

  return (
    <div className="pt-[20px] pb-[20px] flex flex-col items-center bg-stone-800">
      <div className="flex flex-col items-center gap-[20px]">
        <p className="text-4xl text-center text-stone-200">Music Muse</p>
      </div>

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
          className="hover:cursor-pointer border-2 border-stone-400 rounded-md px-2 py-1"
        >
          <p className="text-stone-300">Recommend</p>
        </button>
      </div>

      <div className="mb-[60px] flex flex-col items-center gap-[5px]">
        <img
          src="src/assets/spotify/full_logo_green.png"
          className="w-[150px] "
        />
        <Tooltip text="Link Spotify Account" position="bottom">
          <Link onClick={handleSpotifyConnect} />
        </Tooltip>
      </div>

      <TrackList tracks={tracks} />
    </div>
  );
}

export default App;
