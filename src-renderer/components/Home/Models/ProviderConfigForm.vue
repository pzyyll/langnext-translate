<script setup lang="ts">
import type { ModelProvider } from '~/types/model';

const props = defineProps<{
	provider: ModelProvider;
}>();

const showApiKey = ref(false);
const localApiKey = ref(props.provider.apiKey);
const localApiUrl = ref(props.provider.apiUrl);

watch(
	() => props.provider,
	(p) => {
		localApiKey.value = p.apiKey;
		localApiUrl.value = p.apiUrl;
		showApiKey.value = false;
	}
);
</script>

<template>
	<div class="flex flex-col gap-5">
		<!-- API Key section -->
		<div class="flex flex-col gap-2">
			<div class="flex items-center justify-between">
				<h3 class="text-sm font-semibold">{{ $t('api-key') }}</h3>
			</div>
			<!-- Input row with eye toggle and check button -->
			<div class="flex items-center gap-2">
				<label class="du-input du-input-sm flex flex-1 items-center gap-2">
          <icon-gravity-ui-key/>
					<input
						:type="showApiKey ? 'text' : 'password'"
						v-model="localApiKey"
						:placeholder="$t('api-key-placeholder')"
						class="grow"
					/>
					<button type="button" @click="showApiKey = !showApiKey" class="btn-icon shrink-0">
						<icon-gravity-ui-eye v-if="!showApiKey" class="size-4" />
						<icon-gravity-ui-eye-slash v-else class="size-4" />
					</button>
				</label>
				<button class="du-btn shrink-0 du-btn-outline du-btn-sm">{{ $t('api-key-check') }}</button>
			</div>
		</div>

		<!-- API URL section -->
		<div class="flex flex-col gap-2">
			<div class="flex items-center gap-1">
				<h3 class="text-sm font-semibold">{{ $t('api-url') }}</h3>
			</div>
			<label class="du-validator du-input du-input-sm w-full">
				<icon-gravity-ui-link />
				<input type="text" v-model="localApiUrl" />
			</label>
			<!-- Preview line -->
			<p class="text-xs break-all text-base-content/50">
				{{ $t('api-url-preview') }}：{{ provider.apiUrlPreview || localApiUrl }}
			</p>
		</div>
	</div>
</template>

<style scoped>
input[type='password']::-ms-reveal,
input[type='password']::-ms-clear,
input[type='password']::-webkit-credentials-auto-fill-button,
input[type='password']::-webkit-textfield-decoration-container {
	display: none;
	visibility: hidden;
	pointer-events: none;
}
</style>
