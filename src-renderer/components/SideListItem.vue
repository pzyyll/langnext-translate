<script setup lang="ts">
const props = defineProps({
	showTitle: { type: Boolean, default: true },
	title: { type: String, default: 'dashboard' },
	highlighted: { type: Boolean, default: false }
});
</script>

<template>
	<button
		class="du-btn du-btn-ghost du-btn-sm w-full gap-0 p-0 rounded-2xl"
		:class="{
			'du-btn-active': props.highlighted
		}"
	>
		<div class="flex w-full items-center justify-start">
			<span class="mx-2 flex items-center justify-center">
				<slot name="icon">
					<icon-gravity-ui-list-ul class="size-6" />
				</slot>
			</span>
			<Transition>
				<span v-if="props.showTitle" class="mr-2 whitespace-nowrap text-left">{{
					props.title
				}}</span>
			</Transition>
		</div>
	</button>
</template>

<style scoped>
.v-enter-active,
.v-leave-active {
	transition: all 0.25s ease;
}

.v-enter-from,
.v-leave-to {
	width: 0;
	opacity: 0;
}
</style>
