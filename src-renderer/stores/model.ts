// ABOUTME: Pinia store for model provider configuration and selection state.
// ABOUTME: Manages the list of AI model providers (Anthropic, OpenAI, Gemini, etc.) and their models.

import type { ModelProvider } from '~/types/model';

export const useModelStore = defineStore('model', () => {
	const providers = ref<ModelProvider[]>([
		{
			id: 'newapi',
			name: 'New API',
			icon: undefined,
			color: 'bg-cyan-500',
			enabled: true,
			authType: 'API 密钥',
			apiKey: '',
			apiUrl: 'https://api.newapi.io/v1',
			apiUrlPreview: 'https://api.newapi.io/v1/chat/completions',
			models: []
		},
		{
			id: 'anthropic',
			name: 'Anthropic',
			icon: 'IconClaude',
			color: 'bg-neutral-800',
			enabled: true,
			authType: 'API 密钥',
			apiKey: '',
			apiUrl: 'https://api.anthropic.com',
			apiUrlPreview: 'https://api.anthropic.com/v1/messages',
			docUrl: 'https://docs.anthropic.com',
			modelDocUrl: 'https://docs.anthropic.com/en/docs/models-overview',
			models: [
				{ id: 'claude-3-opus', name: 'claude-3-opus-20240229' },
				{ id: 'claude-3-sonnet', name: 'claude-3-sonnet-20240229' },
				{ id: 'claude-3-haiku', name: 'claude-3-haiku-20240307' },
				{ id: 'claude-35-sonnet', name: 'claude-3-5-sonnet-20241022' },
				{ id: 'claude-35-haiku', name: 'claude-3-5-haiku-20241022' },
				{ id: 'claude-37-sonnet', name: 'claude-3-7-sonnet-20250219' }
			]
		},
		{
			id: 'openai',
			name: 'OpenAI',
			icon: 'IconChatGpt',
			color: 'bg-emerald-600',
			enabled: false,
			authType: 'API 密钥',
			apiKey: '',
			apiUrl: 'https://api.openai.com/v1',
			apiUrlPreview: 'https://api.openai.com/v1/chat/completions',
			docUrl: 'https://platform.openai.com/docs',
			modelDocUrl: 'https://platform.openai.com/docs/models',
			models: [
				{ id: 'gpt-4o', name: 'gpt-4o' },
				{ id: 'gpt-4o-mini', name: 'gpt-4o-mini' },
				{ id: 'gpt-41', name: 'gpt-4.1' },
				{ id: 'gpt-41-mini', name: 'gpt-4.1-mini' }
			]
		},
		{
			id: 'gemini',
			name: 'Google Gemini',
			icon: 'IconGemini',
			color: 'bg-blue-500',
			enabled: false,
			authType: 'API 密钥',
			apiKey: '',
			apiUrl: 'https://generativelanguage.googleapis.com/v1beta',
			apiUrlPreview: 'https://generativelanguage.googleapis.com/v1beta/models',
			docUrl: 'https://ai.google.dev/docs',
			modelDocUrl: 'https://ai.google.dev/models',
			models: [
				{ id: 'gemini-15-pro', name: 'gemini-1.5-pro' },
				{ id: 'gemini-20-flash', name: 'gemini-2.0-flash' }
			]
		}
	]);

	const selectedProviderId = ref<string>('');

	const selectedProvider = computed(() =>
		providers.value.find((p) => p.id === selectedProviderId.value)
	);

	const enabledProviders = computed(() => providers.value.filter((p) => p.enabled));

	function selectProvider(id: string) {
		selectedProviderId.value = id;
	}

	function setProviderEnabled(id: string, enabled: boolean) {
		const provider = providers.value.find((p) => p.id === id);
		if (provider) provider.enabled = enabled;
	}

	/** Initialize selectedProviderId if not already set. */
	function initSelection() {
		if (selectedProviderId.value) return;
		const fallback =
			providers.value.find((p) => p.id === 'openai')?.id ?? providers.value[0]?.id ?? '';
		selectedProviderId.value = fallback;
	}

	return {
		providers,
		selectedProviderId,
		selectedProvider,
		enabledProviders,
		selectProvider,
		setProviderEnabled,
		initSelection
	};
});
