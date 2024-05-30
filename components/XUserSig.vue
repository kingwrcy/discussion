<template>
  <div class="signature text-xs text-primary/70 py-2 line-clamp-1" v-html="signatureHtml">

  </div>
</template>

<script lang="ts" setup>
const props = withDefaults(defineProps<{ signature?: string }>(), {
  signature: ''
})

function convertToHtmlLinks(input: string) {
  const markdownLinkPattern = /\[([^\]]+)\]\((https?:\/\/[^\)]+)\)/g;
  return input.replace(markdownLinkPattern, "<a class='text-blue-500/70' href='$2'>$1</a>");
}

const signatureHtml = computed(() => {
  return convertToHtmlLinks(props.signature)
})
</script>

<style scoped></style>