<script lang="ts" setup>
const props = withDefaults(defineProps<{ signature?: string }>(), {
  signature: '',
})

function convertToHtmlLinks(input: string) {
  const markdownLinkPattern = /\[([^\]]+)\]\((https?:\/\/[^)]+)\)/g
  return input.replace(markdownLinkPattern, '<a class=\'text-blue-500/70\' href=\'$2\'>$1</a>')
}

const signatureHtml = computed(() => {
  return convertToHtmlLinks(props.signature)
})
</script>

<template>
  <div class="hidden md:block signature text-xs text-primary line-clamp-1 " v-html="signatureHtml" />
</template>

<style scoped></style>
