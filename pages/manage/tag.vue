<template>
  <UCard class="flex-1">
    <template #header>
      <UButton @click="doAdd">新增标签</UButton>
    </template>
    <UTable :rows="tagList" :columns="columns">
      <template #avatarUrl-data="{ row }">
        <NuxtLink :to="`/member/${row.username}`">
          <UAvatar :src="getAvatarUrl(row.avatarUrl!)" size="lg" alt="Avatar" />
        </NuxtLink>
      </template>
      <template #actions-data="{ row }">
        <div class="space-x-2">
          <UButton color="white" @click="doEdit(row)">编辑</UButton>
          <UButton color="gray" @click="toggleHot(row)">{{ row.hot ? '取消' : '设为' }}热门</UButton>
        </div>
      </template>
      <template #hot-data="{ row }">
        {{ row.hot ? '是' : '否' }}
      </template>
    </UTable>
    <template #footer>
      <UPagination :to="(page: number) => ({
        query: { page },
      })" class="my-2" v-model="page" :page-count="size" :total="total || 0" v-if="total > size" />
    </template>
  </UCard>

  <UModal v-model="isOpen">
    <div class="p-4 space-y-4">
      <UFormGroup label="名称" name="name">
        <UInput v-model="saveState.name" />
      </UFormGroup>
      <UFormGroup label="描述" name="desc">
        <UTextarea v-model="saveState.desc" />
      </UFormGroup>
      <UButton @click="saveTag">提交</UButton>
    </div>
  </UModal>
</template>

<script lang="ts" setup>
import { toast } from 'vue-sonner';
import type { TagDTO } from '~/types';
const route = useRoute()
definePageMeta({
  layout: 'backend'
})

const page = ref(parseInt(route.query.page as any as string) || 1)
const size = ref(20)

const saveState = reactive({
  name: '',
  desc: '',
  id: 0,
})

const isOpen = ref(false)

const doEdit = (row: TagDTO) => {
  saveState.name = row.name
  saveState.desc = row.desc
  saveState.id = row.id
  isOpen.value = true
}

const doAdd = () => {
  saveState.name = ''
  saveState.desc = ''
  isOpen.value = true
}


const columns = [{
  key: 'name',
  label: '名称'
}, {
  key: 'desc',
  label: '描述'
}, {
  key: 'hot',
  label: '是否热门',
}, {
  key: 'count',
  label: '帖子数量',
}, {
  key: 'actions'
}]

page.value = parseInt(route.query.page as any as string) || 1
let { data: tagListRes } = await useFetch('/api/manage/tagList', {
  method: 'POST',
  body: JSON.stringify({
    page: page.value, size: size.value
  })
})
const tagList = computed(() => tagListRes?.value?.tags as any as TagDTO[])
const total = computed(() => tagListRes?.value?.total as number)

const saveTag = async () => {
  await $fetch('/api/manage/saveTag', {
    method: 'POST',
    body: JSON.stringify(saveState),
  })
  isOpen.value = false
  await reload(page.value)
  toast.success('保存成功')
}

const toggleHot = async (tag: TagDTO) => {
  await $fetch('/api/manage/toggleHot', {
    method: 'POST',
    body: JSON.stringify({
      id: tag.id
    }),
  })
  await reload(page.value)
}

watch(() => route.fullPath, async () => {
  const page = parseInt(route.query.page as any as string)
  await reload(page)
})

const reload = async (page: number) => {
  const res = await $fetch('/api/manage/tagList', {
    method: 'POST',
    body: JSON.stringify({
      page: page, size: size.value
    })
  })
  tagListRes.value = res
}


</script>

<style scoped></style>