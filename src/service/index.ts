// import { fetchTrackRecommendations } from 'src/service/openai';
import {
  getTrack,
  searchTrack,
  removeTrack,
  saveTrack,
  getSongsLikedStatuses,
} from 'src/service/track';
import {
  redirectToSpotify,
  fetchClientAccessToken,
  fetchCurrentUser,
  getRefreshUserAccessToken,
  handleSpotifyCallback,
} from 'src/service/spotifyAuth';

export {
  // fetchTrackRecommendations,
  getTrack,
  searchTrack,
  removeTrack,
  saveTrack,
  getSongsLikedStatuses,
  redirectToSpotify,
  fetchClientAccessToken,
  fetchCurrentUser,
  getRefreshUserAccessToken,
  handleSpotifyCallback,
};
