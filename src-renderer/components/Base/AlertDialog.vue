<script setup lang="ts">
const props = defineProps<{
	title?: string;
	description?: string;
}>();
</script>

<template>
	<AlertDialogRoot>
		<AlertDialogTrigger asChild>
			<slot />
		</AlertDialogTrigger>

		<AlertDialogPortal>
			<Transition name="overlay">
				<AlertDialogOverlay class="fixed inset-0 z-30 bg-black/50" />
			</Transition>
			<Transition>
				<AlertDialogContent
					class="bg-base-100 fixed left-[50%] top-[50%] z-[100] max-h-[85vh] w-[90vw] max-w-80 translate-x-[-50%] translate-y-[-50%] rounded-lg p-4 text-sm focus:outline-none"
				>
					<AlertDialogTitle class="text-base-content m-0 text-lg font-semibold">
						<slot name="title">
							{{ props.title || 'Alert' }}
						</slot>
					</AlertDialogTitle>

					<AlertDialogDescription class="text-base-content mb-5 mt-4 text-sm leading-normal">
						<slot name="description">
							{{ props.description || 'This action cannot be undone.' }}
						</slot>
					</AlertDialogDescription>
					<div class="flex justify-end gap-4">
						<AlertDialogCancel asChild>
							<button class="du-btn du-btn-ghost du-btn-sm">
								<slot name="cancel">
									{{ $t('cancel') }}
								</slot>
							</button>
						</AlertDialogCancel>
						<AlertDialogAction asChild>
							<button class="du-btn du-btn-error du-btn-sm" @click="$emit('confirm')">
								<slot name="action">
									{{ $t('confirm') }}
								</slot>
							</button>
						</AlertDialogAction>
					</div>
				</AlertDialogContent>
			</Transition>
		</AlertDialogPortal>
	</AlertDialogRoot>
</template>

<style scoped>
.v-enter-active,
.v-leave-active {
	transition: all 0.15s ease-in-out;
}

.v-enter-from,
.v-leave-to {
	opacity: 0;
	transform: scale(0.5);
}

.overlay-enter-active,
.overlay-leave-active {
	transition: opacity 0.15s ease-in-out;
}

.overlay-enter-from,
.overlay-leave-to {
	opacity: 0;
}
</style>
