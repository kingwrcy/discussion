<script lang="ts" setup>
import { toast } from 'vue-sonner'
import type { TagDTO } from '~/types'

useHead({
  title: '标签管理',
})
const route = useRoute()
definePageMeta({
  layout: 'backend',
})

const page = ref(Number.parseInt(route.query.page as any as string) || 1)
const size = ref(20)

const saveState = reactive({
  name: '',
  desc: '',
  enName: '',
  id: 0,
})

const isOpen = ref(false)

function doEdit(row: TagDTO) {
  saveState.name = row.name
  saveState.desc = row.desc
  saveState.enName = row.enName
  saveState.id = row.id
  isOpen.value = true
}

function doAdd() {
  saveState.name = ''
  saveState.desc = ''
  saveState.enName = ''
  isOpen.value = true
}

const columns = [{
  key: 'name',
  label: '名称',
}, {
  key: 'enName',
  label: '编码',
}, {
  key: 'desc',
  label: '描述',
}, {
  key: 'hot',
  label: '是否热门',
}, {
  key: 'count',
  label: '帖子数量',
}, {
  key: 'actions',
}]

page.value = Number.parseInt(route.query.page as any as string) || 1
const { data: tagListRes } = await useFetch('/api/manage/tagList', {
  method: 'POST',
  body: JSON.stringify({
    page: page.value,
    size: size.value,
  }),
})
const tagList = computed(() => tagListRes?.value?.tags as any as TagDTO[])
const total = computed(() => tagListRes?.value?.total as number)

async function saveTag() {
  if (!saveState.enName.trim() && !saveState.name.trim() && !saveState.desc.trim()) {
    toast.error('请填写完整,都是必填字段')
    return
  }
  await $fetch('/api/manage/saveTag', {
    method: 'POST',
    body: JSON.stringify(saveState),
  })
  isOpen.value = false
  await reload(page.value)
  toast.success('保存成功')
}

async function toggleHot(tag: TagDTO) {
  await $fetch('/api/manage/toggleHot', {
    method: 'POST',
    body: JSON.stringify({
      id: tag.id,
    }),
  })
  await reload(page.value)
}

watch(() => route.fullPath, async () => {
  const page = Number.parseInt(route.query.page as any as string)
  await reload(page)
})

async function reload(page: number) {
  const res = await $fetch('/api/manage/tagList', {
    method: 'POST',
    body: JSON.stringify({
      page,
      size: size.value,
    }),
  })
  tagListRes.value = res
}
</script>

<template>
  <UCard class="flex-1">
    <template #header>
      <UButton @click="doAdd">
        新增标签
      </UButton>
    </template>
    <UTable :rows="tagList" :columns="columns">
      <template #avatarUrl-data="{ row }">
        <NuxtLink :to="`/member/${row.username}`">
          <UAvatar :src="getAvatarUrl(row.avatarUrl!)" size="lg" alt="Avatar" />
        </NuxtLink>
      </template>
      <template #actions-data="{ row }">
        <div class="space-x-2">
          <UButton color="white" @click="doEdit(row)">
            编辑
          </UButton>
          <UButton color="gray" @click="toggleHot(row)">
            {{ row.hot ? '取消' : '设为' }}热门
          </UButton>
        </div>
      </template>
      <template #hot-data="{ row }">
        {{ row.hot ? '是' : '否' }}
      </template>
    </UTable>
    <template #footer>
      <UPagination
        v-if="total > size" v-model="page" size="sm" :to="(page: number) => ({
          query: { page },
        })" class="my-2" :page-count="size" :total="total || 0"
      />
    </template>
  </UCard>

  <UModal v-model="isOpen">
    <div class="p-4 space-y-4">
      <UFormGroup label="名称" name="name">
        <UInput v-model="saveState.name" />
      </UFormGroup>
      <UFormGroup label="编码" name="enName">
        <UInput v-model="saveState.enName" />
      </UFormGroup>
      <UFormGroup label="描述" name="desc">
        <UTextarea v-model="saveState.desc" />
      </UFormGroup>
      <UButton @click="saveTag">
        提交
      </UButton>
    </div>
  </UModal>
</template>

<style scoped></style>
