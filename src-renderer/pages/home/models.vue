<script setup lang="ts">
import { useSortable } from '@vueuse/integrations/useSortable';

// Mock data for demonstration (will be replaced with actual store later)
const mockModels = ref<Array<{
	id: string;
	name: string;
	enable: boolean;
	provider: string;
	context: string;
}>>([
	// Uncomment to show example cards:
	// {
	// 	id: '1',
	// 	name: 'gpt-4o',
	// 	enable: true,
	// 	provider: 'OpenAI',
	// 	context: '128K tokens'
	// },
	// {
	// 	id: '2',
	// 	name: 'claude-3-5-sonnet',
	// 	enable: false,
	// 	provider: 'Anthropic',
	// 	context: '200K tokens'
	// }
]);

const el = useTemplateRef<HTMLElement>('el');
useSortable(el, mockModels, {
	animation: 150,
	handle: '.cursor-grab'
});

// Placeholder functions for future implementation
function onClickEdit(id: string) {
	console.log('Edit model:', id);
	// TODO: Open model config dialog
}

function onDeleteModel(id: string) {
	console.log('Delete model:', id);
	mockModels.value = mockModels.value.filter((m) => m.id !== id);
}

function onSwitchChange(id: string, value: boolean) {
	console.log('Toggle model:', id, value);
	const model = mockModels.value.find((m) => m.id === id);
	if (model) {
		model.enable = value;
	}
}

function onAddModel() {
	console.log('Add new model');
	// TODO: Open add model dialog
}
</script>

<template>
	<div class="flex h-full w-full flex-col">
		<!-- Header Section -->
		<div class="mb-6 flex items-start gap-4">
			<div
				class="bg-accent/10 border-accent/20 flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border backdrop-blur-sm"
			>
				<icon-gravity-ui-sparkles class="text-accent h-7 w-7" />
			</div>
			<div class="flex-1">
				<h1 class="text-2xl font-bold tracking-tight">
					{{ $t('models') }}
				</h1>
				<p class="text-base-content/60 mt-1 text-sm leading-relaxed">
					{{ $t('models-description') }}
				</p>
			</div>
		</div>

		<!-- Content Area -->
		<div class="flex flex-1 flex-col">
			<!-- Empty State (shown when no models) -->
			<div
				v-if="mockModels.length === 0"
				class="flex flex-1 flex-col items-center justify-center"
			>
				<div
					class="bg-base-200/50 border-base-300/50 relative flex flex-col items-center gap-6 rounded-3xl border p-12 backdrop-blur-sm"
				>
					<!-- Animated gradient background -->
					<div
						class="from-accent/5 via-primary/5 to-secondary/5 pointer-events-none absolute inset-0 rounded-3xl bg-gradient-to-br opacity-50"
					/>

					<!-- Icon with glow effect -->
					<div class="relative">
						<div
							class="bg-accent/20 absolute inset-0 animate-pulse rounded-full blur-2xl"
						/>
						<div
							class="bg-base-100 border-base-300 relative flex h-24 w-24 items-center justify-center rounded-full border-2 shadow-lg"
						>
							<icon-gravity-ui-sparkles class="text-accent h-12 w-12" />
						</div>
					</div>

					<!-- Text content -->
					<div class="relative text-center">
						<h3 class="text-base-content text-lg font-semibold">
							{{ $t('no-models') }}
						</h3>
						<p class="text-base-content/50 mt-2 max-w-xs text-sm leading-relaxed">
							{{ $t('no-models-hint') }}
						</p>
					</div>

					<!-- Add button -->
					<button
						@click="onAddModel"
						class="du-btn du-btn-primary du-btn-sm hover:shadow-accent/20 relative mt-2 gap-2 shadow-lg transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl"
					>
						<icon-gravity-ui-plus class="h-4 w-4" />
						<span>{{ $t('add-model') }}</span>
					</button>

					<!-- Decorative elements -->
					<div
						class="bg-accent/10 absolute -right-4 -top-4 h-20 w-20 rounded-full blur-3xl"
					/>
					<div
						class="bg-primary/10 absolute -bottom-4 -left-4 h-20 w-20 rounded-full blur-3xl"
					/>
				</div>

				<!-- Bottom hint -->
				<div class="text-base-content/40 mt-8 flex items-center gap-2 text-xs">
					<icon-gravity-ui-circle-info class="h-4 w-4" />
					<span>{{ $t('models-support-hint') }}</span>
				</div>
			</div>

			<!-- Model List (shown when models exist) -->
			<div v-else class="flex w-full flex-col gap-2">
				<div ref="el" class="flex w-full flex-col gap-2">
					<div v-for="model in mockModels" :key="model.id">
						<HomeComponentCard
							:name="model.name"
							:switchValue="model.enable"
							@click-delete="onDeleteModel(model.id)"
							@click-edit="onClickEdit(model.id)"
							@switch-change="(value: boolean) => onSwitchChange(model.id, value)"
						/>
					</div>
				</div>

				<!-- Add New Card -->
				<button
					@click="onAddModel"
					class="du-btn du-btn-ghost hover:bg-accent/10 hover:border-accent bg-accent/5 border-accent/30 h-14 w-full items-center justify-center gap-2 rounded-lg border-2 border-dashed opacity-80 transition-all duration-200 hover:-translate-y-[1px] hover:opacity-100"
				>
					<icon-gravity-ui-plus class="text-accent h-5 w-5" />
					<span class="text-accent text-sm font-medium">{{ $t('add-model') }}</span>
				</button>
			</div>
		</div>
	</div>
</template>

<style scoped>
/* Subtle pulse animation for glow effect */
@keyframes pulse {
	0%,
	100% {
		opacity: 0.5;
	}
	50% {
		opacity: 0.8;
	}
}
</style>
