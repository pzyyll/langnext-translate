<script setup lang="ts">
import GravityUiServer from '~icons/gravity-ui/server';
import GravityUiGear from '~icons/gravity-ui/gear';
import GravityUiCircleInfo from '~icons/gravity-ui/circle-info';
import GravityUiThunderbolt from '~icons/gravity-ui/thunderbolt';
import GravityUiArchive from '~icons/gravity-ui/archive';
import GravityUiSparkles from '~icons/gravity-ui/sparkles';

definePageMeta({
	layout: false,
	middleware: [
		function (to: { path: string }) {
			if (to.path === '/home' || to.path === '/home/') {
				return navigateTo('/home/services')
			}
		}
	]
});

const sideItems = ref([
	{ title: 'services', icon: GravityUiServer, path: '/home/services' },
	{ title: 'models', icon: GravityUiSparkles, path: '/home/models' },
	{ title: 'quick-input', icon: GravityUiThunderbolt, path: '/home/quick-input' },
	{ title: 'settings', icon: GravityUiGear, path: '/home/settings' },
	{ title: 'backup', icon: GravityUiArchive, path: '/home/backup' },
	{ title: 'info', icon: GravityUiCircleInfo, path: '/home/about' }
]);

const selectedIndex = ref(0);
async function clickIdx(index: number) {
	// Handle click event for the sidebar item
	selectedIndex.value = index;
	console.log(`Clicked on item ${index}`);
}
</script>

<template>
	<NuxtLayout name="main">
		<template #sidebar>
			<nav class="p-2">
				<ul class="flex flex-col gap-1">
					<li v-for="(item, index) in sideItems" :key="index">
						<NuxtLink :to="item.path" v-slot="{ isActive }" class="select-none" draggable="false">
							<SideListItem
								:title="$t(item.title)"
								@click="clickIdx(index)"
								:highlighted="isActive"
							>
								<template #icon>
									<component :is="item.icon" class="size-6" />
								</template>
							</SideListItem>
						</NuxtLink>
					</li>
				</ul>
			</nav>
		</template>

		<div class="flex h-full flex-col p-4">
			<NuxtPage />
		</div>
	</NuxtLayout>
</template>

<style>
.page-enter-active,
.page-leave-active {
	transition: all 0.15s;
}
.page-enter-from,
.page-leave-to {
	opacity: 0;
	filter: blur(1rem);
}
</style>
