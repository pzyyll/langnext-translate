<script setup lang="ts">
import type { FunctionalComponent, SVGAttributes } from "vue";

import IconGoogle from "~icons/svgs/google-translate-logo";
import IconDeepL from "~icons/svgs/deepl-logo";
import IconBaidu from "~icons/svgs/baidu-logo";
import IconChatGpt from "~icons/svgs/chatgpt-logo";
import IconGemini from "~icons/svgs/gemini-logo";
import IconClaude from "~icons/svgs/claude-logo";

const props = defineProps<{
  name: string;
}>();

const components: Record<string, FunctionalComponent<SVGAttributes>> = {
  IconGoogle,
  IconDeepL,
  IconBaidu,
  IconChatGpt,
  IconGemini,
  IconClaude
};
</script>

<template>
  <component :is="components[props.name]" />
</template>
