import 'dotenv/config';
import { OpenAI } from 'openai';

async function main() {
	const apiKey = process.env.OPENAI_API_KEY;
	const baseURL = process.env.OPENAI_BASE_URL;

	console.log('Testing OpenAI API connection...', { apiKey: !!apiKey, baseURL });
  const client = new OpenAI({ apiKey, baseURL });

  try {
    const models = await client.models.list();
    console.log('Successfully connected to OpenAI API. Available models:', models.data);
  } catch (error) {
    console.error('Failed to connect to OpenAI API:', error);
  }
}

main().catch(console.error);
