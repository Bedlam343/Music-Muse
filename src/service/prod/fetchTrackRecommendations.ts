import { NETLIFY_SERVERLESS_BASE_URL } from 'src/utils/constants';
import { type Parameters } from 'src/utils/types';

export default async (parameters: Parameters) => {
  const queryString = new URLSearchParams(parameters).toString();

  const url = `${NETLIFY_SERVERLESS_BASE_URL}/fetchRecommendations?${queryString}`;
  const response = await fetch(url);
  const recommendations = await response.json();

  return recommendations as string[];
};
