<script setup lang="ts">
import { useSortable } from '@vueuse/integrations/useSortable';
import { shallowRef, useTemplateRef } from 'vue';

const el = useTemplateRef<HTMLElement>('el');
const list = shallowRef([
	{ id: 1, name: 'a' },
	{ id: 2, name: 'b' },
	{ id: 3, name: 'c' }
]);

useSortable(el, list);
</script>

<template>
	<div ref="el">
		<div v-for="item in list" :key="item.id">
			{{ item.name }}
		</div>
	</div>
</template>
