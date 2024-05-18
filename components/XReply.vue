<template>
  <div class="flex flex-col  py-2 border-b border-primary/10" v-if="token">
    <MdEditor style="height:200px;" v-model="state.content" :preview="false" :toolbars="toolbars"
      :editor-id="`post-${pid}`" />
    <div class="flex my-2">
      <UButton @click="reply">发表评论</UButton>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { ToolbarNames } from 'md-editor-v3';
import { MdEditor } from 'md-editor-v3';

const config = useRuntimeConfig()
const token = useCookie(config.public.tokenKey)
const props = defineProps<{
  pid: string
}>()

const emits = defineEmits(['commented'])

const toolbars: ToolbarNames[] = [
  'bold',
  'underline',
  '-',
  'strikeThrough',
  'quote',
  'unorderedList',
  'orderedList',
  '-',
  'codeRow',
  'code',
  'link',
  'image',
  'table',
  '-',
  'revoke',
  'next',
  '=',
  'preview',
];
const state = reactive({
  content: ""
})

const reply = async () => {
  const res = await $fetch('/api/comment/new', {
    method: 'POST',
    body: JSON.stringify({
      content: state.content.trim(),
      pid: props.pid
    })
  })
  if (res.success) {
    state.content = ''
    emits('commented')
  }
}
</script>

<style scoped></style>