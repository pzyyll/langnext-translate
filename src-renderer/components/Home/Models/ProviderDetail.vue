<script setup lang="ts">
import type { ModelProvider } from '~/types/model'

const props = defineProps<{
  provider?: ModelProvider
}>()

const modelStore = useModelStore()

const localEnabled = computed({
  get: () => props.provider?.enabled ?? false,
  set: (value) => {
    if (props.provider) {
      modelStore.setProviderEnabled(props.provider.id, value)
    }
  }
})
</script>

<template>
  <div class="flex h-full flex-col">
    <!-- Empty state when no provider -->
    <div v-if="!provider" class="flex flex-1 items-center justify-center">
      <p class="text-sm text-base-content/50">{{ $t('no-provider-selected') }}</p>
    </div>

    <!-- Provider detail when selected -->
    <div v-else class="flex flex-col gap-6 p-6">
      <!-- Header row -->
      <div class="flex items-center gap-2">
        <h2 class="text-lg font-bold">{{ provider.name }}</h2>
        <icon-gravity-ui-arrow-up-right-from-square class="size-4 cursor-pointer opacity-50" />
        <icon-gravity-ui-gear class="size-4 cursor-pointer opacity-50" />
        <div class="flex-1" />
        <input
          type="checkbox"
          v-model="localEnabled"
          class="du-toggle du-toggle-sm du-toggle-success"
        />
      </div>

      <!-- Config form -->
      <HomeModelsProviderConfigForm :provider="provider" />

      <!-- Model list (only when provider has models) -->
      <HomeModelsModelList
        v-if="provider.models.length > 0"
        :models="provider.models"
        :providerName="provider.name"
        :docUrl="provider.docUrl"
        :modelDocUrl="provider.modelDocUrl"
      />
    </div>
  </div>
</template>
