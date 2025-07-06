<script setup lang="ts">
import { useScroll } from '@vueuse/core';

import {
	HomeServicesOcr,
	HomeServicesTranslate,
	HomeServicesSpeech,
	HomeServicesNote
} from '#components';

const tabs = shallowRef([
	{ label: 'translate', content: HomeServicesTranslate },
	{ label: 'ocr', content: HomeServicesOcr },
	{ label: 'speech', content: HomeServicesSpeech },
	{ label: 'note', content: HomeServicesNote }
]);
const selectedTab = ref(tabs.value[0].label);

const scrollEl = useTemplateRef<HTMLElement>('scrollEl');
const { arrivedState } = useScroll(scrollEl);

watch(arrivedState, (arrived) => {
	if (arrived.top && !arrived.bottom) {
		scrollEl.value?.style.setProperty('--scroll-mask-top-color', 'black');
		scrollEl.value?.style.setProperty('--scroll-mask-bottom-color', 'transparent');
	} else if (arrived.bottom && !arrived.top) {
		scrollEl.value?.style.setProperty('--scroll-mask-top-color', 'transparent');
		scrollEl.value?.style.setProperty('--scroll-mask-bottom-color', 'black');
	} else if (!arrived.top && !arrived.bottom) {
		scrollEl.value?.style.setProperty('--scroll-mask-top-color', 'transparent');
		scrollEl.value?.style.setProperty('--scroll-mask-bottom-color', 'transparent');
	} else {
		scrollEl.value?.style.setProperty('--scroll-mask-top-color', 'black');
		scrollEl.value?.style.setProperty('--scroll-mask-bottom-color', 'black');
	}
});
</script>

<template>
	<div class="flex h-full pb-1">
		<TabsRoot class="flex w-full flex-col" v-model="selectedTab">
			<TabsList class="border-b-base-300 relative flex shrink-0 border-b" aria-label="Services">
				<TabsIndicator
					class="w-(--reka-tabs-indicator-size) translate-x-(--reka-tabs-indicator-position) transition-x absolute bottom-0 left-0 h-[2px] rounded-full duration-200"
				>
					<div class="bg-accent h-full w-full" />
				</TabsIndicator>
				<TabsTrigger
					v-for="tab in tabs"
					:key="tab.label"
					:value="tab.label"
					class="text-neutral hover:text-accent data-[state=active]:text-accent flex h-10 cursor-default select-none items-center justify-center px-4 text-sm leading-none outline-none focus-visible:relative focus-visible:shadow-[0_0_0_2px] focus-visible:shadow-black"
				>
					{{ $t(tab.label) }}
				</TabsTrigger>
			</TabsList>
			<div class="scroll-mask relative flex-1 overflow-hidden overflow-y-auto" ref="scrollEl">
				<Transition v-for="tab in tabs" :key="tab.label">
					<TabsContent
						:key="tab.label"
						:value="tab.label"
						class="relative flex h-full pt-4"
						v-show="selectedTab === tab.label"
					>
						<component :is="tab.content" />
					</TabsContent>
				</Transition>
			</div>
		</TabsRoot>
	</div>
</template>

<style scoped>
.v-enter-active,
.v-leave-active {
	transition:
		opacity 0.25s ease-in-out,
		transform 0.25s ease-in-out;
	/* 防止组件切换时布局跳动 */
	position: absolute;
	width: 100%;
}

.v-enter-from,
.v-leave-to {
	opacity: 0;
	transform: translateX(15px);
}

.scroll-mask {
	--scroll-mask-top-color: black;
	--bottom-color: transparent;

	mask-image: linear-gradient(
		to bottom,
		var(--scroll-mask-top-color) 0%,
		black 1rem,
		black calc(100% - 1rem),
		var(--scroll-mask-bottom-color) 100%
	);
}
</style>
