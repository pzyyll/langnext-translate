<script setup lang="ts">
const { $tauri } = useNuxtApp();
import { getCurrentWindow as getCurrent } from '@tauri-apps/api/window';

let is_maximized = ref(false);
let is_pin = ref(false);

const appWindow = getCurrent();

const onToggleMaximize = () => {
	appWindow.toggleMaximize().then(() => {
		appWindow.isMaximized().then((maximized) => {
			is_maximized.value = maximized;
			console.log('is_maximized', is_maximized.value);
		});
	});
};

const onTogglePin = () => {
	is_pin.value = !is_pin.value;
	// appWindow.setAlwaysOnTop(is_pin.value);
};
watch(is_pin, (value) => {
	$tauri.setTranslateWinPin(value);
});
</script>
<template>
	<div data-tauri-drag-region class="relative flex h-8">
		<div
			id="titlebar-title"
			data-tauri-drag-region
			class="absolute inset-y-0 left-0 flex items-center"
		>
			<button class="du-btn btn-none no-app-drag min-h-0" @click="onTogglePin">
				<icon-clarity-pin-line v-if="!is_pin" />
				<icon-clarity-pin-solid v-else />
			</button>
		</div>
		<div class="absolute inset-y-0 right-0 flex h-full items-center">
			<!-- <button
        class="du-btn du-btn-ghost rounded-none h-full min-h-0 select-none no-app-drag"
        id="titlebar-minimize"
        @click="appWindow.minimize"
      >
        <icon-clarity-minus-line />
      </button> -->
			<!-- <button
        class="du-btn du-btn-ghost rounded-none h-full min-h-0 select-none no-app-drag"
        id="titlebar-maximize"
        @click="onToggleMaximize"
      >
        <icon-clarity-window-max-line v-if="!is_maximized" />
        <icon-clarity-window-restore-line v-else />
      </button> -->
			<button
				class="du-btn btn-none no-app-drag hover:bg-red-600! active:bg-red-700! group hover:bg-opacity-85"
				id="titlebar-close"
				@click="appWindow.close"
			>
				<icon-clarity-close-line class="group-hover:text-white group-active:text-white" />
			</button>
		</div>
	</div>
</template>

<style scoped>
/* @reference "@/assets/css/main.css"; */
</style>
