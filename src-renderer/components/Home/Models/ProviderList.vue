<script setup lang="ts">
const props = defineProps<{
  providers: { id: string; name: string; icon?: string; color?: string; enabled: boolean }[]
  selectedId: string
}>()

defineEmits<{
  select: [id: string]
}>()

const searchQuery = ref('')

const filteredProviders = computed(() =>
  props.providers.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
)
</script>

<template>
  <div class="flex h-full flex-col">
    <!-- Search bar -->
    <div class="shrink-0 p-2">
      <label class="du-input du-input-sm flex w-full items-center gap-2 rounded-2xl">
        <icon-gravity-ui-magnifier class="size-4 shrink-0 opacity-50" />
        <input v-model="searchQuery" class="grow" :placeholder="$t('provider-search')" />
      </label>
    </div>

    <!-- Scrollable provider list -->
    <ul class="flex flex-1 flex-col gap-1 overflow-y-auto px-2">
      <li v-for="provider in filteredProviders" :key="provider.id">
        <HomeModelsProviderListItem
          :name="provider.name"
          :icon="provider.icon"
          :color="provider.color"
          :enabled="provider.enabled"
          :selected="provider.id === selectedId"
          @click="$emit('select', provider.id)"
        />
      </li>
    </ul>

    <!-- Add button at bottom -->
    <div class="shrink-0 border-t border-base-300 p-2">
      <button class="du-btn du-btn-xs du-btn-ghost w-full gap-2 text-xs rounded-2xl">
        <icon-gravity-ui-plus class="size-4" />
        {{ $t('add-model-btn') }}
      </button>
    </div>
  </div>
</template>
