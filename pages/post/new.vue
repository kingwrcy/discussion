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
          <USelectMenu value-attribute="id" option-attribute="desc" v-model="state.tags" :options="options" multiple>
            <template #label>
              <span v-if="state.tags.length" class="truncate">{{ selectedTagDesc }}</span>
              <span v-else>请选择至少一个标签</span>
            </template>
          </USelectMenu>
        </UFormGroup>
        <UFormGroup label="正文" name="content">
          <MdEditor v-model="state.content" />
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
import { z } from 'zod'
import type { FormSubmitEvent } from '#ui/types'
import { createPostSchema } from '~/types';
import { toast } from 'vue-sonner';
import { MdEditor   } from 'md-editor-v3';
import 'md-editor-v3/lib/style.css';
type Schema = z.output<typeof createPostSchema>



const options = ref([
  { id: 1, name: 'bug', desc: '问题' },
  { id: 2, name: 'documentation', desc: '文档' },
])



const state = reactive<Schema>({
  title: "",
  content: "",
  tags: [options.value[0].id]
})

const selectedTagDesc = computed(() => {
  let label: string = ""
  state.tags.map(id => {
    label += (options.value.find(x => x.id === id)?.desc + ",")
  })
  if (label.length > 0) {
    return label.substring(0, label.length - 1)
  }
  return label
})

const pending = ref(false)

async function onSubmit(event: FormSubmitEvent<Schema>) {
  // pending.value = true
  const result = await $fetch('/api/post/new', {
    method: 'POST',
    body: JSON.stringify(event.data)
  })
  if (result.success && 'pid' in result) {
    toast.success('发表成功')
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