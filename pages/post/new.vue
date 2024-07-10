<script lang="ts" setup>
import { MdEditor, type ToolbarNames } from 'md-editor-v3'
import 'md-editor-v3/lib/style.css'
import { toast } from 'vue-sonner'
import type { z } from 'zod'
import { useColorMode } from '@vueuse/core'
import type { FormError, FormSubmitEvent } from '#ui/types'
import type { PostDTO, SysConfigDTO, UserDTO } from '~/types'
import { createPostSchema } from '~/types'
import { getLength } from '~/utils'

type Schema = z.output<typeof createPostSchema>

const userinfo = useState<UserDTO>('userinfo')
const global = useGlobalConfig()
const sysconfig = global.value?.sysConfig as SysConfigDTO
onMounted(() => {
  window.addEventListener('keydown', handleKeyDown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyDown)
})
const mode = useColorMode()

const route = useRoute()

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

const tagRes = await useFetch('/api/go/list', {
  method: 'POST',
  key: 'tagLists',
})
const tags = computed(() => {
  const items = tagRes.data.value?.tags.map((item) => {
    return { name: item.name, id: item.id, desc: `${item.enName} / ${item.desc}` }
  })
  return items
})
const readRoleList = computed(() => {
  const result = []
  for (let i = 1; i <= userinfo.value.level; i++) {
    result.push({ id: i, desc: `LV ${i}` })
  }
  result.push({ id: 999, desc: '私有' })
  result.unshift({ id: 0, desc: '公开' })
  return result
})

const state = reactive<Schema>({
  pid: '',
  title: '',
  content: '',
  tagId: 0,
  readRole: 0,
})

async function loadPost() {
  const query = route.query
  const pid = (query.pid) as string || ''
  if (!pid)
    return
  const res = (await $fetch(`/api/post/${pid}`, {
    method: 'POST',
    body: JSON.stringify({}),
  })) as any as { post: PostDTO }
  Object.assign(state, res.post)
}

await loadPost()
watch(() => route.fullPath, loadPost)

const pending = ref(false)

async function doPostNew(data: Schema, token: string = '') {
  const result = await $fetch('/api/post/new', {
    method: 'POST',
    body: JSON.stringify({ ...data, token }),
  })
  if (result.success && 'pid' in result) {
    userCardChanged.emit()
    toast.success(`帖子发表成功,自动跳转中...`)
    setTimeout(() => {
      navigateTo(`/post/${result.pid}`)
    }, 200)
  }
  else if ('message' in result) {
    toast.error(`发表失败,${result.message}`)
  }
}

async function onSubmit(event: FormSubmitEvent<Schema>) {
  pending.value = true
  if (sysconfig.googleRecaptcha && sysconfig.googleRecaptcha.enable) {
    grecaptcha.ready(() => {
      grecaptcha.execute(sysconfig.googleRecaptcha.siteKey, { action: 'newPost' }).then(async (token) => {
        await doPostNew(event.data, token)
        pending.value = false
      })
    })
  }
  else {
    await doPostNew(event.data)
    pending.value = false
  }
}

const form = ref<HTMLFormElement>()

async function handleKeyDown(event: KeyboardEvent) {
  if (event.ctrlKey && event.key === 'Enter') {
    form.value?.submit()
  }
}
function validate(state: any): FormError[] {
  const errors = []
  if (!state.title || getLength(state.title) < 6)
    errors.push({ path: 'title', message: '标题最少6个字符,中文一个算2个字符' })
  if (!state.content || getLength(state.content) < 6)
    errors.push({ path: 'content', message: '内容最少6个字符,中文一个算2个字符' })
  if (!state.tagId || state.tagId === 0)
    errors.push({ path: 'tags', message: '需要选择一个合适的标签' })
  return errors
}
useHead({
  title: `发表帖子`,
})
</script>

<template>
  <UCard class="w-full mt-2">
    <template #header>
      <div class="text-center text-sm">
        发表新帖子
      </div>
    </template>
    <div class="flex flex-col my-2 ">
      <UForm
        ref="form" :validate="validate" :schema="createPostSchema" :state="state" :validate-on="['submit']"
        class="space-y-4" autocomplete="off" @submit="onSubmit"
      >
        <UFormGroup label="标题" name="title" required>
          <UInput v-model="state.title" autocomplete="off" />
        </UFormGroup>
        <UFormGroup label="标签" name="tags" required>
          <USelectMenu v-model="state.tagId" value-attribute="id" option-attribute="desc" :options="tags" />
        </UFormGroup>
        <UFormGroup label="阅读限制" name="tags" required>
          <USelectMenu v-model="state.readRole" value-attribute="id" option-attribute="desc" :options="readRoleList" />
        </UFormGroup>
        <UFormGroup label="正文" name="content" required>
          <ClientOnly>
            <MdEditor
              v-model="state.content" style="max-height: 600px;" :preview="false" :theme="mode as any"
              :toolbars="toolbars" editor-id="newPost" @on-upload-img="onUploadImg"
            >
              <template #defToolbars>
                <XEmoji />
                <XYoutubeDialog />
              </template>
            </MdEditor>
          </ClientOnly>
        </UFormGroup>
        <div>
          <UButton type="submit" :loading="pending" :disabled="pending">
            发表(Ctrl+Enter提交)
          </UButton>
        </div>
      </UForm>
    </div>
  </UCard>
</template>

<style scoped></style>
