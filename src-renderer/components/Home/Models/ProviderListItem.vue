<script setup lang="ts">
defineProps<{
  name: string
  icon?: string
  color?: string
  enabled: boolean
  selected: boolean
}>()
</script>

<template>
  <button
    class="flex h-8 w-full items-center gap-3 rounded-2xl px-3 du-btn du-btn-ghost du-btn-xs"
		:class="{
			'du-btn-active': selected
		}"
  >
    <SvgsIcon v-if="icon" :name="icon" class="size-6 rounded-full" />
    <div v-else class="du-avatar du-avatar-placeholder shrink-0 select-none">
      <div class="size-6 rounded-full text-white" :class="color || 'bg-neutral'">
        <span class="text-sm font-bold">{{ name.charAt(0).toUpperCase() }}</span>
      </div>
    </div>

    <span class="flex-1 text-left text-sm font-medium">{{ name }}</span>

    <span v-if="enabled" class="du-badge du-badge-success du-badge-sm text-xs">
      {{ $t('provider-on') }}
    </span>
  </button>
</template>
