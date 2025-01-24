const MODE = import.meta.env.MODE;
import { Parameters } from 'src/utils/types';
import devFetchRecommendations from './dev/fetchTrackRecommendations';
import prodFetchRecommendations from './prod/fetchTrackRecommendations';

let fetchTrackRecommendations: (parameters: Parameters) => Promise<string[]>;

if (MODE === 'production') {
  fetchTrackRecommendations = prodFetchRecommendations;
} else {
  fetchTrackRecommendations = devFetchRecommendations;
}

export { fetchTrackRecommendations };
