<template>
  <div class="flex flex-col  py-2 w-full " v-if="token">
    <MdEditor style="height:200px;" :no-upload-img="true" v-model="state.content" :preview="false" :toolbars="toolbars"
      :editor-id="`post-${pid}`" >
      <template #defToolbars>
              <XEmoji />
            </template>
          </MdEditor>
    <div class="flex my-2">
      <UButton @click="reply">发表评论</UButton>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { ToolbarNames } from 'md-editor-v3';
import { MdEditor } from 'md-editor-v3';
import { config as mdConfig } from 'md-editor-v3';
import LinkAttr from 'markdown-it-link-attributes';
import { breakpointsTailwind, useBreakpoints } from '@vueuse/core'
const breakpoints = useBreakpoints(breakpointsTailwind)
const mdAndLarger = breakpoints.greaterOrEqual('md')

const config = useRuntimeConfig()
const token = useCookie(config.public.tokenKey)
const props = defineProps<{
  pid: string
}>()
mdConfig({
  markdownItConfig(md) {
    md.use(LinkAttr, {
      attrs: {
        target: '_blank'
      }
    });
    
  }
});

commentQuoted.on((content: string) => {
  state.content = `> ${content}\n\n`
})

const emits = defineEmits(['commented'])

const toolbars: ToolbarNames[] = mdAndLarger.value ? [
  0,
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
] : [
0,
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
  'image'
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
    userCardChanged.emit()
  }
}
</script>

<style scoped></style>