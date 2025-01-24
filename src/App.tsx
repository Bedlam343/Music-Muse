import { ChangeEvent, useEffect, useMemo, useRef, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import {
  Parameters as ParametersType,
  Track,
  TracksStatus,
  User,
} from 'src/utils/types';
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
  fetchTrackRecommendations,
} from 'src/service';
import Parameters from 'src/components/Parameters';
import Modal from 'src/components/common/Modal';
import LinkSpotifyAccount from 'src/components/LinkSpotifyAccount';
import {
  CLIENT_ACCESS_TOKEN,
  DEFAULT_PARAMETERS,
  USER_ACCESS_TOKEN,
  USER_EXPIRES_AT,
  USER_REFRESH_TOKEN,
} from 'src/utils/constants';

window.onload = fetchClientAccessToken;

function App() {
  const [currentUser, setCurrentUser] = useState<User>();
  const [parameters, setParameters] = useState<ParametersType>({
    ...DEFAULT_PARAMETERS,
  });
  const [tracks, setTracks] = useState<Track[]>([]);
  const [displayConnectModal, setDisplayConnectModal] =
    useState<boolean>(false);
  const [animteSpotifyLink, setAnimateSpotifyLink] = useState<boolean>(false);
  const [tracksStatus, setTracksStatus] = useState<TracksStatus>('unfetched');

  const trackListRef = useRef<HTMLDivElement>(null);
  const linkSpotifyRef = useRef<HTMLDivElement>(null);

  const trackIds: string = useMemo(
    () => tracks.map(({ id }) => id).join(','),
    [tracks]
  );

  useEffect(() => {
    const refreshUser = () => {
      const refreshToken = localStorage.getItem(USER_REFRESH_TOKEN);
      if (refreshToken) {
        getRefreshUserAccessToken(refreshToken);
      }
    };

    // refresh user every 15 minutes
    const timeout: NodeJS.Timeout = setInterval(refreshUser, 1000 * 60 * 15);

    return () => clearInterval(timeout);
  }, []);

  // on initial window load
  useEffect(() => {
    const getUserInformation = async () => {
      let userAccessToken = localStorage.getItem(USER_ACCESS_TOKEN);

      if (!userAccessToken || userAccessToken === 'undefined') {
        localStorage.removeItem(USER_ACCESS_TOKEN);
        localStorage.removeItem(USER_EXPIRES_AT);
        localStorage.removeItem(USER_REFRESH_TOKEN);
        await handleSpotifyCallback();
      }

      userAccessToken = localStorage.getItem(USER_ACCESS_TOKEN);

      if (userAccessToken) {
        const user = await fetchCurrentUser(userAccessToken);
        if (user) setCurrentUser(user);
      }
    };

    getUserInformation();

    const stateStr = localStorage.getItem('state');
    if (!stateStr) return;

    const state: { parameters: ParametersType; tracks: Track[] } =
      JSON.parse(stateStr);
    setTracks(state.tracks);
    setParameters(state.parameters);

    localStorage.removeItem('state');

    return () => {
      localStorage.removeItem(USER_ACCESS_TOKEN);
    };
  }, []);

  // fetch liked status of recommended songs
  useEffect(() => {
    const userAccessToken =
      localStorage.getItem(USER_ACCESS_TOKEN) ?? undefined;

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

  useEffect(() => {
    scrollToTracks();
  }, [trackIds]);

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (animteSpotifyLink) {
      timeout = setTimeout(() => setAnimateSpotifyLink(false), 8000);
    }
    return () => clearTimeout(timeout);
  }, [animteSpotifyLink]);

  const handleParameterChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const parameter = event.target.id as keyof ParametersType;
    setParameters((prevParameters) => ({
      ...prevParameters,
      [parameter]: event.target.value,
    }));
  };

  const handleRecommend = async () => {
    const clientAccessToken = localStorage.getItem(CLIENT_ACCESS_TOKEN);
    if (!clientAccessToken) return;

    setTracksStatus('fetching');

    const recommendations = await fetchTrackRecommendations(parameters);

    const promises = recommendations.map((entry) => {
      const [artistname, trackname] = entry.split(' -- ') || entry.split('--');
      return searchTrack(trackname, artistname, clientAccessToken);
    });

    const foundTracks = await Promise.all(promises);
    const newTracks = foundTracks.filter((track) => Boolean(track)) as Track[];
    setTracks(newTracks);
    setTracksStatus('fetched');
  };

  const handleSpotifyConnect = () => {
    redirectToSpotify({ parameters, tracks });
  };

  const handleLikeTrack = async (trackId: string) => {
    const user_access_token = localStorage.getItem(USER_ACCESS_TOKEN);
    if (!user_access_token || user_access_token === 'undefined') {
      scrollToSpotifyLink();
      setAnimateSpotifyLink(true);
      toast('Link Spotify Account to Save Tracks', { position: 'top-center' });
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
    const user_access_token = localStorage.getItem(USER_ACCESS_TOKEN);
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

  const unlikeAllTracks = () => {
    setTracks((prevTracks) => {
      const updatedTracks = [...prevTracks];
      updatedTracks.forEach((track) => (track.likedByCurrentUser = false));
      return updatedTracks;
    });
  };

  const handleSpotifyUnlink = () => {
    setCurrentUser(undefined);
    unlikeAllTracks();
    localStorage.removeItem(USER_ACCESS_TOKEN);
    localStorage.removeItem(USER_REFRESH_TOKEN);
    localStorage.removeItem(USER_EXPIRES_AT);
    toast('Spotify Account Unlinked', {
      position: 'top-center',
      type: 'success',
    });
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
            <img src="/spotify/full_logo_green.png" className="w-[100px]" />
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

  const scrollToTracks = () => {
    if (trackListRef.current) {
      trackListRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToSpotifyLink = () => {
    if (linkSpotifyRef.current) {
      linkSpotifyRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }
  };

  return (
    <>
      <div className="pt-[30px] pb-[50px] flex flex-col items-center bg-stone-800">
        <div className="flex flex-col items-center">
          <div className="flex items-center gap-[5px]">
            <p className="text-spotifyGreen text-4xl">&#119070;</p>
            <p className="text-4xl text-center text-stone-300">Music Muse</p>
          </div>

          <p className="italic text-spotifyGreen text-sm">
            Find Music You Love
          </p>
        </div>

        <div className="mt-[40px]">
          <Parameters
            parameters={parameters}
            onParameterChange={handleParameterChange}
            onRecommend={handleRecommend}
            disableRecommend={tracksStatus === 'fetching'}
          />
        </div>

        <div className="mt-[50px] mb-[50px]">
          <LinkSpotifyAccount
            ref={linkSpotifyRef}
            accountId={currentUser?.id}
            accountLink={currentUser?.external_urls.spotify}
            handleConnect={handleSpotifyConnect}
            animate={animteSpotifyLink}
            onSpotifyUnlink={handleSpotifyUnlink}
          />
        </div>

        <TrackList
          ref={trackListRef}
          tracks={tracks}
          onLikeTrack={handleLikeTrack}
          onUnlikeTrack={handleUnlikeTrack}
          tracksStatus={tracksStatus}
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
