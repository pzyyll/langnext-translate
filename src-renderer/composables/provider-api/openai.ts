import { OpenAI } from 'openai';

export function useOpenaiAPI(apiKey: string, baseURL?: string) {
	// Your OpenAI API logic here

	const resolvedBaseURL = baseURL ?? 'https://api.openai.com/v1';

	const client = new OpenAI({
		baseURL: resolvedBaseURL,
		apiKey
	});

	async function generateContent(
		model: string,
		instructions: string,
		input: string | OpenAI.Responses.ResponseInput | undefined
	) {
		const response = await client.responses.create({
			model,
			instructions,
			input
		});
		return response;
	}

	async function fetchModels() {
		try {
			const models = await client.models.list();
			return models.data; // Return the list of models
		} catch (error) {
			console.error('Error fetching OpenAI models:', error);
			return []; // Return an empty array if there's an error
		}
	}

	async function testConnection(model: string) {
		try {
			await client.responses.create({
				model,
				input: "Hi",
				max_output_tokens: 1
			});
			return true;
		} catch (error) {
			console.error('Error testing OpenAI connection:', error);
			return false;
		}
	}

	return {
		generateContent,
		testConnection,
		fetchModels
	};
}
