import { ChangeEvent, useEffect, useState } from 'react';
import {
  Parameters as ParametersType,
  Genre,
  TimeOfDay,
  Mood,
  Activity,
  Track,
  User,
} from 'src/utils/types';
import TrackList from 'src/components/TrackList';
import {
  searchTrack,
  handleSpotifyCallback,
  redirectToSpotify,
  fetchCurrentUser,
} from 'src/service';
import Link from 'src/icons/Link';
import Tooltip from 'src/components/common/Tooltip';
import Parameters from 'src/components/Parameters';
import Modal from 'src/components/common/Modal';

const SPOTIFY_CLIENT_ID = import.meta.env.VITE_SPOTIFY_CLIENT_ID as string;
const SPOTIFY_CLIENT_SECRET = import.meta.env
  .VITE_SPOTIFY_CLIENT_SECRET as string;

const DEFAULT_PARAMETERS: ParametersType = {
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
  const [currentUser, setCurrentUser] = useState<User>();
  const [parameters, setParameters] = useState<ParametersType>({
    ...DEFAULT_PARAMETERS,
  });
  const [tracks, setTracks] = useState<Track[]>([]);

  const [displayConnectModal, setDisplayConnectModal] =
    useState<boolean>(false);

  console.log(currentUser);

  // on initial window load
  useEffect(() => {
    const getUserInformation = async () => {
      // also check expiration date?
      let userAccessToken =
        localStorage.getItem('user_access_token') || undefined;
      if (!userAccessToken) {
        userAccessToken = await handleSpotifyCallback();
      }

      if (userAccessToken) {
        localStorage.setItem('user_access_token', userAccessToken);
        const user = await fetchCurrentUser(userAccessToken);
        if (user) setCurrentUser(user);
      }
    };

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
      localStorage.setItem('client_access_token', data.access_token);
    };

    getUserInformation();
    getClientAccessToken();

    const stateStr = localStorage.getItem('state');
    if (!stateStr) return;

    const state: { parameters: ParametersType; tracks: Track[] } =
      JSON.parse(stateStr);
    setTracks(state.tracks);
    setParameters(state.parameters);

    localStorage.removeItem('state');
  }, []);

  const handleParameterChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const parameter = event.target.id as keyof ParametersType;
    setParameters((prevParameters) => ({
      ...prevParameters,
      [parameter]: event.target.value,
    }));
  };

  const handleRecommend = async () => {
    const clientAccessToken = localStorage.getItem('client_access_token');
    if (!clientAccessToken) return;

    const promises = DUMMY_LIST.map((entry) => {
      const [trackname, artistname] = entry.split(',');
      return searchTrack(trackname, artistname, clientAccessToken);
    });

    const newTracks = await Promise.all(promises);
    setTracks(newTracks.filter((track) => Boolean(track)) as Track[]);
  };

  const handleSpotifyConnect = () => {
    redirectToSpotify({ parameters, tracks });
  };

  const handleLikeTrack = (trackId: string) => {
    const user_access_token = localStorage.getItem('user_access_token');
    if (!user_access_token || user_access_token === 'undefined') {
      setDisplayConnectModal(true);
      return;
    }
  };

  const renderSpotifyConnectModal = () => {
    if (displayConnectModal) {
      return (
        <Modal
          open={displayConnectModal}
          onClose={() => setDisplayConnectModal(false)}
        >
          <div
            className="flex flex-col items-center gap-[15px] bg-stone-800 
            max-w-[350px] px-6 py-4 rounded-lg"
          >
            <img
              src="src/assets/spotify/full_logo_green.png"
              className="w-[100px]"
            />
            <p className="text-stone-300">
              Link Your Spotify Account To Save Songs
            </p>
            <button
              onClick={handleSpotifyConnect}
              className="text-spotifyGreen border-[1px] border-spotifyGreen 
              rounded-md px-2 py-1 w-[75px]"
            >
              Link
            </button>
          </div>
        </Modal>
      );
    }

    return null;
  };

  return (
    <>
      <div className="pt-[20px] pb-[20px] flex flex-col items-center bg-stone-800">
        <div className="flex flex-col items-center gap-[20px]">
          <p className="text-4xl text-center text-stone-200">Music Muse</p>
        </div>

        <div className="mt-[40px] flex flex-col gap-[35px] mb-[50px]">
          <Parameters
            parameters={parameters}
            onParameterChange={handleParameterChange}
          />

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

        <TrackList tracks={tracks} onLikeTrack={handleLikeTrack} />
      </div>

      {renderSpotifyConnectModal()}
    </>
  );
}

export default App;
