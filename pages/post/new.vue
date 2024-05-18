<template>
  <UCard class="w-full mt-2">
    <template #header class="py-1">
      <div class="text-center text-sm">发表新帖子</div>
    </template>
    <div class="flex flex-col my-2 ">
      <UForm :schema="createPostSchema" :state="state" :validate-on="['submit']" class="space-y-4" @submit="onSubmit"
        autocomplete="off">
        <UFormGroup label="标题" name="title">
          <UInput v-model="state.title" autocomplete="off" />
        </UFormGroup>
        <UFormGroup label="标签" name="tags">
          <USelectMenu value-attribute="id" option-attribute="desc" v-model="state.tags" :options="tags" multiple>
            <template #label>
              <span v-if="state.tags.length" class="truncate">{{ selectedTagDesc }}</span>
              <span v-else>请选择至少一个标签</span>
            </template>
          </USelectMenu>
        </UFormGroup>
        <UFormGroup label="正文" name="content">
          <MdEditor style="max-height: 400px;" v-model="state.content" :preview="false" :toolbars="toolbars"
            editor-id="newPost" />
        </UFormGroup>
        <div>
          <UButton type="submit" :loading="pending">
            发表
          </UButton>
        </div>
      </UForm>
    </div>
  </UCard>
</template>


<script lang="ts" setup>
import { object, z } from 'zod'
import type { FormSubmitEvent } from '#ui/types'
import { createPostSchema, type PostDTO, type TagDTO } from '~/types';
import { toast } from 'vue-sonner';
import { MdEditor, type ToolbarNames } from 'md-editor-v3';
import 'md-editor-v3/lib/style.css';
type Schema = z.output<typeof createPostSchema>

const route = useRoute()

const toolbars: ToolbarNames[] = [
  'bold',
  'underline',
  '-',
  'title',
  'strikeThrough',
  'quote',
  'unorderedList',
  'orderedList',
  'task',
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
const tagRes = useFetch('/api/tag/list', {
  method: 'POST',
  key: "tagLists"
})
const tags = computed(() => {
  const items = tagRes.data.value?.tags.map(item => { return { name: item.name, id: item.id, desc: item.name + ' / ' + item.desc } })
  return items
})


const state = reactive<Schema>({
  pid: "",
  title: "",
  content: "",
  tags: [0]
})

const loadPost = async ()=>{
  const query = route.query
  const pid = (query.pid) as string || ''
  if (!pid) return
  const res = (await $fetch('/api/post/' + pid,{
    method:'POST',
    body:JSON.stringify({})
  })) as any as {post:PostDTO}
  // Object.assign(state,res.post)
  //@ts-ignore
  state.tags = res.post.tags?.map(x=>x.id)
  state.content = res.post.content
  state.title = res.post.title
  state.pid = res.post.pid
}

await loadPost()
watch(() => route.fullPath, loadPost)

const selectedTagDesc = computed(() => {
  let label: string = ""
  state.tags.filter(x => x > 0).map(id => {
    label += (tags.value?.find(x => x.id === id)?.name + ",")
  })
  if (label.length > 0) {
    return label.substring(0, label.length - 1)
  }
  return label || '请选择标签,最少一个,最多三个'
})

const pending = ref(false)

async function onSubmit(event: FormSubmitEvent<Schema>) {
  console.log(state.tags)
  if(state.tags.filter(x=>x>0).length <= 0 ){
    toast.error('请选择标签,最少一个,最多三个')
    return
  }
  pending.value = true
  const result = await $fetch('/api/post/new', {
    method: 'POST',
    body: JSON.stringify(event.data)
  })
  if (result.success && 'pid' in result) {
    setTimeout(() => {
      navigateTo(`/post/${result.pid}`)
    }, 200)
  } else if ('message' in result) {
    toast.error('发表失败,' + (result.message))
  }
  pending.value = false
}
</script>

<style scoped></style>