<script lang="ts" setup>
import type { ToolbarNames } from 'md-editor-v3'
import { MdEditor } from 'md-editor-v3'
import { useColorMode } from '@vueuse/core'
import type { CommentQuotedPayload } from '~/utils/eventbus'

const props = defineProps<{
  pid: string
}>()
const emits = defineEmits(['commented'])
const mode = useColorMode()
const editorRef = ref()
const newCid = ref()
const config = useRuntimeConfig()
const token = useCookie(config.public.tokenKey)

const state = reactive({
  content: '',
})

async function handleKeyDown(event: KeyboardEvent) {
  if (event.ctrlKey && event.key === 'Enter') {
    await reply()
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleKeyDown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyDown)
})

commentQuoted.on((param: CommentQuotedPayload) => {
  let content = ''
  if (state.content.length > 0) {
    content = '\r\n'
  }
  content = param.cid ? param.content : `${content}@${param.username} [#${param.floor}](/post/${param.pid}#${param.floor}) `
  newCid.value = param.cid
  editorRef.value?.insert(() => {
    return {
      targetValue: content,
      select: false,
      deviationStart: state.content.length + content.length + 1,
      deviationEnd: 0,
    }
  })
})

const toolbars: ToolbarNames[] = [
  0,
  1,
  'bold',
  'underline',
  'strikeThrough',
  'quote',
  'unorderedList',
  'orderedList',
  'codeRow',
  'code',
  'link',
  'image',
  'table',
  'pageFullscreen',
  'preview',
]

async function reply() {
  const res = await $fetch('/api/comment/new', {
    method: 'POST',
    body: JSON.stringify({
      content: state.content.trim(),
      pid: props.pid,
      cid: newCid.value,
    }),
  })
  if (res.success) {
    state.content = ''
    newCid.value = ''
    emits('commented')
    userCardChanged.emit()
  }
}
</script>

<template>
  <div v-if="token" class="flex flex-col  py-2 w-full ">
    <MdEditor
      ref="editorRef" v-model="state.content" :theme="mode as any" style="max-height:300px;"
      :preview="false" :toolbars="toolbars" :editor-id="`post-${pid}`" @on-upload-img="onUploadImg"
    >
      <template #defToolbars>
        <XEmoji />
        <XYoutubeDialog />
      </template>
    </MdEditor>
    <div class="flex my-2">
      <UButton @click="reply">
        发表评论(Ctrl+Enter提交)
      </UButton>
    </div>
  </div>
</template>

<style scoped></style>
