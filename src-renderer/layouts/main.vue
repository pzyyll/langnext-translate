<script setup lang="ts">
useHead({
	htmlAttrs: {
		class: 'bg-base-200 h-screen'
	},
	bodyAttrs: {
		class: 'bg-base-200 h-screen'
	}
});
</script>

<template>
	<div class="flex h-screen w-full flex-col">
		<header>
			<WinTitleBarDefault class="border-b-base-300 border-b-[1px]" />
			<!-- <WinTitleBar /> -->
		</header>
		<div class="flex flex-1 overflow-hidden">
			<!-- 左侧导航菜单区域 -->
			<aside class="border-r-base-300 flex flex-col gap-1 overflow-y-auto border-r-[1px]">
				<slot name="sidebar" />
			</aside>

			<!-- 右侧内容展示区域 -->
			<main class="flex-1">
				<slot />
			</main>
		</div>
	</div>
</template>

<style scoped>
.sidebar-title-enter-active,
.sidebar-title-leave-active {
	transition: all 0.25s ease;
}

.sidebar-title-enter-from,
.sidebar-title-leave-to {
	width: 0;
	opacity: 0;
}
</style>
