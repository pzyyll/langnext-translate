import 'dotenv/config';
import { generateText, Output } from 'ai';
import { createOpenAI } from '@ai-sdk/openai';
import z from 'zod';
import fs from 'fs';

const baseModel = 'gpt-5.4-mini';
const apiKey = process.env.OPENAI_API_KEY;
const baseURL = process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1';

const openai = createOpenAI({
	apiKey,
	baseURL
});

const i18nPath = 'src-renderer/i18n/locales';

const responseFormat = Output.array({
	element: z.object({
		key: z.string(),
		value: z.string()
	})
});

async function getAllTargetLanguages() {
	const files = await fs.promises.readdir(i18nPath);
	const targetLanguages = files
		.filter((file) => file.endsWith('.json') && file !== 'zh.json')
		.map((file) => file.replace('.json', ''));
	return targetLanguages;
}

async function generateContent(srcData: string, targetLanguage = 'en') {
	const { output } = await generateText({
		model: openai(baseModel),
		system: `
You are a localization expert, translating the provided localization JSON file content into the corresponding language.

## Translation Instructions
- Only translate the value parts of the JSON file, not the keys.
- Keys ending with the suffix '-nt' do not require translation; just keep them as is.
- Ensure the translated text is natural and appropriate for the target language.
- Ensure that original key names remain unchanged, only the value part needs to be translated, and no deletions should be made.
`,
		prompt: `
Please translate the JSON file content into ${targetLanguage}:						
\`\`\`json
${srcData}
\`\`\`
`,
		output: responseFormat
	});

	return output;
}

async function main() {
	try {
		const targetLanguages = await getAllTargetLanguages();
		if (targetLanguages.length === 0) {
			console.error('No target languages found in the i18n directory.');
			return;
		}

		const srcFilePath = `${i18nPath}/zh.json`;
		const srcData = await fs.promises.readFile(srcFilePath, 'utf-8');

		// Process all languages concurrently
		const translationPromises = targetLanguages.map(async (targetLanguage) => {
			try {
				console.log(`Generating content for ${targetLanguage}...`);

				const content = await generateContent(srcData, targetLanguage);
				const targetFilePath = `${i18nPath}/${targetLanguage}.json`;

				if (content.length === 0) {
					console.error(`No content generated for ${targetLanguage}. Skipping...`);
					return { language: targetLanguage, success: false };
				}

				const outputObject: Record<string, string> = {};
				// Convert the array of items to an object
				content.forEach((item) => {
					outputObject[item.key] = item.value;
				});

				// Write the generated content to the target file
				await fs.promises.writeFile(targetFilePath, JSON.stringify(outputObject, null, 2));
				console.log(`Content for ${targetLanguage} written to ${targetFilePath}`);
				return { language: targetLanguage, success: true };
			} catch (error) {
				console.error(`Error processing ${targetLanguage}:`, error);
				return { language: targetLanguage, success: false, error };
			}
		});

		// Wait for all translations to complete
		const results = await Promise.all(translationPromises);

		// Log summary
		const successful = results.filter((r) => r.success).length;
		const failed = results.filter((r) => !r.success).length;
		console.log(`\nTranslation completed: ${successful} successful, ${failed} failed`);

		if (failed > 0) {
			const failedLanguages = results.filter((r) => !r.success).map((r) => r.language);
			console.log(`Failed languages: ${failedLanguages.join(', ')}`);
		}
	} catch (error) {
		console.error('Error generating content:', error);
	}
}

main();
