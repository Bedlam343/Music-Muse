import { Context } from '@netlify/functions';
import OpenAI from 'openai';

const OPENAI_API_KEY = process.env.OPENAI_API_KEY as string;

const openai = new OpenAI({
  apiKey: OPENAI_API_KEY,
  dangerouslyAllowBrowser: true,
});

export default async (request: Request, context: Context) => {
  const searchParams = request.url.split('?')[1];
  const parameters = searchParams.split('&');
  const query = parameters.join(' ');

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

  const content = completion.choices[0].message.content;

  if (!content) return [];

  const recommendations = content?.split(', ');
  return new Response(JSON.stringify(recommendations));
};
