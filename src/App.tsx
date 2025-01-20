import { ChangeEvent, useEffect, useMemo, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import { Parameters as ParametersType, Track, User } from 'src/utils/types';
import TrackList from 'src/components/TrackList';
import {
  searchTrack,
  handleSpotifyCallback,
  redirectToSpotify,
  fetchCurrentUser,
  getSongsLikedStatuses,
  saveTrack,
  removeTrack,
  fetchClientAccessToken,
  getRefreshUserAccessToken,
} from 'src/service';
import Parameters from 'src/components/Parameters';
import Modal from 'src/components/common/Modal';
import LinkSpotifyAccount from 'src/components/LinkSpotifyAccount';
import {
  CLIENT_ACCESS_TOKEN,
  CLIENT_EXPIRES_AT,
  DEFAULT_PARAMETERS,
  DUMMY_RECOMMENDATIONS,
  USER_ACCESS_TOKEN,
  USER_EXPIRES_AT,
  USER_REFRESH_TOKEN,
} from 'src/utils/constants';

window.onload = handleSpotifyCallback;

function App() {
  const [currentUser, setCurrentUser] = useState<User>();
  const [parameters, setParameters] = useState<ParametersType>({
    ...DEFAULT_PARAMETERS,
  });
  const [tracks, setTracks] = useState<Track[]>([]);
  const [displayConnectModal, setDisplayConnectModal] =
    useState<boolean>(false);

  const trackIds: string = useMemo(
    () => tracks.map(({ id }) => id).join(','),
    [tracks]
  );

  // on initial window load
  useEffect(() => {
    const getUserInformation = async () => {
      const refreshToken = localStorage.getItem(USER_REFRESH_TOKEN);
      const expiresAt = localStorage.getItem(USER_EXPIRES_AT);

      if (expiresAt && refreshToken && Number(expiresAt) <= Date.now()) {
        await getRefreshUserAccessToken(refreshToken);
      }

      const userAccessToken = localStorage.getItem(USER_ACCESS_TOKEN);

      if (userAccessToken) {
        const user = await fetchCurrentUser(userAccessToken);
        if (user) setCurrentUser(user);
      }
    };

    const getClientAccessToken = () => {
      const clientAccessToken = localStorage.getItem(CLIENT_ACCESS_TOKEN);
      const expiresAt = localStorage.getItem(CLIENT_EXPIRES_AT);

      // fetch client access token if not token or previous one expired
      if (
        !clientAccessToken ||
        (expiresAt && Number(expiresAt) <= Date.now())
      ) {
        fetchClientAccessToken();
      }
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

  // fetch liked status of recommended songs
  useEffect(() => {
    const userAccessToken =
      localStorage.getItem('user_access_token') ?? undefined;

    if (tracks.length === 0 || !userAccessToken) return;

    const getSongStatues = async () => {
      const statuses = await getSongsLikedStatuses(
        trackIds.split(','),
        userAccessToken
      );

      setTracks((prevTracks) => {
        const updatedTracks: Track[] = [...prevTracks];
        statuses.forEach((status, index) => {
          updatedTracks[index].likedByCurrentUser = status;
        });
        return updatedTracks;
      });
    };

    getSongStatues();
  }, [tracks.length, trackIds]);

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

    const promises = DUMMY_RECOMMENDATIONS.map((entry) => {
      const [trackname, artistname] = entry.split(',');
      return searchTrack(trackname, artistname, clientAccessToken);
    });

    const foundTracks = await Promise.all(promises);
    const newTracks = foundTracks.filter((track) => Boolean(track)) as Track[];
    setTracks(newTracks);
  };

  const handleSpotifyConnect = () => {
    redirectToSpotify({ parameters, tracks });
  };

  const handleLikeTrack = async (trackId: string) => {
    const user_access_token = localStorage.getItem('user_access_token');
    if (!user_access_token || user_access_token === 'undefined') {
      setDisplayConnectModal(true);
      return;
    }

    const success = await saveTrack(trackId, user_access_token);

    if (success) {
      setTracks((prevTracks) => {
        const updatedTracks = [...prevTracks];
        const likedTrack = updatedTracks.find((track) => track.id === trackId);
        if (likedTrack) {
          likedTrack.likedByCurrentUser = true;
        }
        return updatedTracks;
      });

      toast('Added to Liked Songs.');
    }
  };

  const handleUnlikeTrack = async (trackId: string) => {
    const user_access_token = localStorage.getItem('user_access_token');
    if (!user_access_token) return;

    const success = await removeTrack(trackId, user_access_token);
    if (success) {
      setTracks((prevTracks) => {
        const updatedTracks = [...prevTracks];
        const unlikedTrack = updatedTracks.find(
          (track) => track.id === trackId
        );
        if (unlikedTrack) {
          unlikedTrack.likedByCurrentUser = false;
        }
        return updatedTracks;
      });

      toast('Removed From Liked Songs.');
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
        <div className="flex flex-col items-center">
          <div className="flex items-center gap-[5px]">
            <p className="text-spotifyGreen text-4xl">&#119070;</p>
            <p className="text-4xl text-center text-stone-300">Music Muse</p>
          </div>

          <p className="italic text-spotifyGreen text-sm">
            Find Music You Love
          </p>
        </div>

        <div className="mt-[40px] mb-[50px]">
          <Parameters
            parameters={parameters}
            onParameterChange={handleParameterChange}
            onRecommend={handleRecommend}
          />
        </div>

        <LinkSpotifyAccount
          accountId={currentUser?.id}
          accountLink={currentUser?.external_urls.spotify}
          handleConnect={handleSpotifyConnect}
        />

        <TrackList
          tracks={tracks}
          onLikeTrack={handleLikeTrack}
          onUnlikeTrack={handleUnlikeTrack}
        />
      </div>

      {renderSpotifyConnectModal()}

      <ToastContainer
        position="bottom-center"
        autoClose={3000}
        pauseOnHover={false}
        hideProgressBar
      />
    </>
  );
}

export default App;
