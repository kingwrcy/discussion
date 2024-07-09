<script lang="ts" setup>
import type { ToolbarNames } from 'md-editor-v3'
import { MdEditor } from 'md-editor-v3'
import { useColorMode } from '@vueuse/core'
import type { CommentQuotedPayload } from '~/utils/eventbus'

const props = defineProps<{
  pid: string
}>()

const emits = defineEmits(['commented'])

onMounted(() => {
  window.addEventListener('keydown', handleKeyDown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyDown)
})

const editorRef = ref()
const newCid = ref()
const config = useRuntimeConfig()
const token = useCookie(config.public.tokenKey)
const pending = ref(false)

const state = reactive({
  content: '',
})

async function handleKeyDown(event: KeyboardEvent) {
  if (event.ctrlKey && event.key === 'Enter') {
    await reply()
  }
}

commentQuoted.on((param: CommentQuotedPayload) => {
  let content = ''
  if (state.content.length > 0) {
    content = '\r\n'
  }
  content = param.cid ? param.content : `${content}[@${param.username}](/member/${param.username}) [#${param.floor}](/post/${param.pid}#${param.floor}) `
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
  if (!state.content.trim())
    return
  if (pending.value)
    return
  pending.value = true
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
  pending.value = false
}
const color = useColorMode()
const theme = ref<'light' | 'dark'>(color.value === 'dark' ? 'dark' : 'light')
themeChanged.on((val) => {
  theme.value = val === 'dark' ? 'dark' : 'light'
})
</script>

<template>
  <div v-if="token" class="flex flex-col  py-2 w-full ">
    <MdEditor
      ref="editorRef" v-model="state.content" :theme="theme" style="max-height:300px;" :preview="false"
      :toolbars="toolbars" :editor-id="`post-${pid}`" @on-upload-img="onUploadImg"
    >
      <template #defToolbars>
        <XEmoji />
        <XYoutubeDialog />
      </template>
    </MdEditor>
    <div class="flex my-2">
      <UButton :disabled="pending" @click="reply">
        发表评论(Ctrl+Enter提交)
      </UButton>
    </div>
  </div>
</template>

<style scoped></style>
