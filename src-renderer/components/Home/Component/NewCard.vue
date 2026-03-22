<script setup lang="ts">
const props = defineProps({
	text: { type: String, default: 'New Card' }
});
</script>
<template>
	<button
		class="du-btn du-btn-ghost hover:bg-primary/10 hover:border-primary bg-primary/10 border-primary h-14 w-full items-center justify-center gap-2 rounded-lg border-2 border-dashed opacity-80 transition-transform duration-100 hover:-translate-y-px hover:opacity-100"
	>
		<icon-gravity-ui-plus class="text-primary-content" />
		<span class="text-primary-content text-xs">{{ $t(props.text) }}</span>
	</button>
</template>
