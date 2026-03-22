<script setup lang="ts">
// ABOUTME: Flat model list for a provider, with doc links and action buttons.
// ABOUTME: Receives a plain ModelItem[] and renders each model as a row.

import type { ModelItem } from '~/types/model'

defineProps<{
  models: ModelItem[]
  providerName: string
  docUrl?: string
  modelDocUrl?: string
}>()
</script>

<template>
  <div class="flex flex-col gap-4">
    <!-- Section header row -->
    <div class="flex items-center gap-2">
      <h3 class="text-sm font-semibold">{{ $t('model') }}</h3>
      <span class="du-badge du-badge-ghost du-badge-sm">{{ models.length }}</span>
      <icon-gravity-ui-magnifier class="size-4 cursor-pointer opacity-50" />
      <div class="flex-1" />
      <icon-gravity-ui-chevrons-expand-up-right class="size-4 cursor-pointer opacity-50" />
    </div>

    <!-- Flat model list -->
    <div class="flex flex-col gap-0.5">
      <div
        v-for="model in models"
        :key="model.id"
        class="flex items-center gap-2 rounded-md bg-base-200/50 px-4 py-2 text-sm hover:bg-base-200"
      >
        <span>{{ model.name }}</span>
      </div>
    </div>

    <!-- Documentation link -->
    <p class="text-xs opacity-60">
      {{ $t('view-docs') }}
      <a v-if="docUrl" class="du-link du-link-info" :href="docUrl" target="_blank">
        {{ providerName }} {{ $t('docs-link') }}
      </a>
      <span v-else>{{ providerName }} {{ $t('docs-link') }}</span>
      {{ $t('and') }}
      <a v-if="modelDocUrl" class="du-link du-link-info" :href="modelDocUrl" target="_blank">
        {{ $t('models-link') }}
      </a>
      <span v-else>{{ $t('models-link') }}</span>
      {{ $t('docs-suffix') }}
    </p>

    <!-- Action buttons -->
    <div class="flex gap-2">
      <button class="du-btn du-btn-primary du-btn-sm">
        <icon-gravity-ui-list-ul class="size-4" />
        {{ $t('manage-models') }}
      </button>
      <button class="du-btn du-btn-outline du-btn-sm">
        <icon-gravity-ui-plus class="size-4" />
        {{ $t('add-model-btn') }}
      </button>
    </div>
  </div>
</template>
