<script setup lang="ts">
const store = useModelStore();
const { providers, selectedProviderId, selectedProvider } = storeToRefs(store);

store.initSelection();
</script>

<template>
	<div class="-m-4 flex h-[calc(100%+2rem)]">
		<div class="flex min-w-40 shrink-0 flex-col border-r border-r-base-300">
			<HomeModelsProviderList
				:providers="providers"
				:selectedId="selectedProviderId"
				@select="store.selectProvider($event)"
			/>
		</div>
		<div class="flex flex-1 flex-col overflow-y-auto">
			<HomeModelsProviderDetail :provider="selectedProvider" />
		</div>
	</div>
</template>
