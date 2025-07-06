<script setup lang="ts">
import { useSortable } from '@vueuse/integrations/useSortable';

const translateApiStore = useTranslateApiStore();

const { channels } = storeToRefs(translateApiStore);

const el = useTemplateRef<HTMLElement>('el');
useSortable(el, channels, {
	animation: 150,
	handle: '.cursor-grab'
});

async function onDeleteChannel(id: string) {
	console.log('Deleting channel with ID:', id);
	await translateApiStore.DeleteChannel(id);
}

function onSwitchChange(id: string, value: boolean) {
	translateApiStore.GetChannelById(id).then((value) => {
		console.log(value);
	});

	console.log('Switch changed for channel ID:', id, 'to value:', value);
	translateApiStore.UpdateChannelField(id, 'enable', value);
}

onMounted(() => {
	for (const channel of channels.value) {
		console.log('Channel:', channel);
	}
});
</script>

<template>
	<div class="flex w-full flex-col gap-2">
		<div ref="el" class="flex w-full flex-col gap-2">
			<div v-for="channel in channels" :key="channel.id">
				<HomeComponentCard
					:name="channel.name"
					:switchValue="channel.enable"
					@click-delete="onDeleteChannel(channel.id)"
					@switch-change="(value: boolean) => onSwitchChange(channel.id, value)"
				/>
			</div>
		</div>
		<HomeServicesTranslateConfigDialog />
	</div>
</template>
