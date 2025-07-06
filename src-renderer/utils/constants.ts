export const enum TranslateApiType {
	OpenAI = 'openai',
	DeepL = 'deepl',
	Google = 'google',
	Baidu = 'baidu',
	Youdao = 'youdao',
	Custom = 'custom'
}

export type TranslateApiTypeValue = `${TranslateApiType}`;