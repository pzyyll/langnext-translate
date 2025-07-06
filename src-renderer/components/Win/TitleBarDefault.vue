<script setup lang="ts">
import { getCurrentWindow as getCurrent } from '@tauri-apps/api/window';

const props = defineProps({
	title: { type: String, default: '' },
	minimize: { type: Boolean, default: false },
	maximized: { type: Boolean, default: false },
	close: { type: Boolean, default: false }
});

const checkMaximizedState = async () => {
	is_maximized.value = await appWindow.isMaximized();
};

let is_maximized = ref(false);

const appWindow = getCurrent();

const onToggleMaximize = () => {
	appWindow.toggleMaximize().then(() => {
		checkMaximizedState();
	});
};

onMounted(() => {
	checkMaximizedState();
	appWindow.onResized(() => {
		checkMaximizedState();
	});
});
</script>
<template>
	<div data-tauri-drag-region class="relative flex h-8">
		<div
			id="titlebar-title"
			data-tauri-drag-region
			class="absolute inset-y-0 left-2 flex items-center"
		>
			<icon-svgs-lnb class="pointer-events-none" />
			<span class="pointer-events-none ml-2 select-none" v-show="props.title">{{
				$t(props.title)
			}}</span>
		</div>
		<div class="absolute inset-y-0 right-0 flex h-full items-center">
			<button
				class="du-btn btn-none no-app-drag h-full min-h-0"
				id="titlebar-minimize"
				v-show="props.minimize"
				@click="appWindow.minimize"
			>
				<icon-clarity-minus-line />
			</button>
			<button
				class="du-btn btn-none no-app-drag min-h-0"
				id="titlebar-maximize"
				v-show="props.maximized"
				@click="onToggleMaximize"
			>
				<icon-clarity-window-max-line v-if="!is_maximized" />
				<icon-clarity-window-restore-line v-else />
			</button>
			<button
				class="du-btn btn-none no-app-drag group min-h-0 hover:bg-red-600 hover:bg-opacity-85 active:bg-red-800"
				id="titlebar-close"
				@click="appWindow.close"
				v-show="props.close"
			>
				<icon-clarity-close-line class="group-hover:text-white group-active:text-white" />
			</button>
		</div>
	</div>
</template>
