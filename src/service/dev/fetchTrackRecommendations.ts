import OpenAI from 'openai';
import { Parameters } from 'src/utils/types';
const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY as string;

export default async (parameters: Parameters) => {
  const openai = new OpenAI({
    apiKey: OPENAI_API_KEY,
    dangerouslyAllowBrowser: true,
  });

  const query = Object.keys(parameters)
    .map(
      (parameterKey) =>
        `${parameterKey}=${parameters[parameterKey as keyof Parameters]}`
    )
    .join(' ');

  const completion = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    store: true,
    messages: [
      {
        role: 'system',
        content:
          'No introductions. No newline. Return comma-separated string. Separate arist & song by a "--".',
      },
      {
        role: 'user',
        content: `Find 10 spotify songs (& artist) for following parameters: ${query}.`,
      },
    ],
  });

  console.log('Token Usage:', completion.usage);

  const content = completion.choices[0].message.content;
  console.log('Recommended songs:', content);

  if (!content) return [];

  const recommendations = content?.split(', ');
  return recommendations;
};
