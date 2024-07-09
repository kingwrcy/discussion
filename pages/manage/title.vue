<script lang="ts" setup>
import { toast } from 'vue-sonner'
import type { TitleDTO } from '~/types'

useHead({
  title: '头衔管理',
})
const route = useRoute()
definePageMeta({
  layout: 'backend',
})

const page = ref(Number.parseInt(route.query.page as any as string) || 1)
const size = ref(20)

const saveState = reactive({
  style: '',
  title: '',
  status: true,
  id: 0,
})

const isOpen = ref(false)

function doEdit(row: TitleDTO) {
  saveState.style = row.style
  saveState.status = row.status
  saveState.title = row.title
  saveState.id = row.id
  isOpen.value = true
}

function doAdd() {
  saveState.style = ''
  saveState.status = true
  saveState.title = ''
  isOpen.value = true
}

const columns = [{
  key: 'title',
  label: '名称',
}, {
  key: 'style',
  label: '样式',
}, {
  key: 'status',
  label: '状态',
}, {
  key: 'count',
  label: '帖子数量',
}, {
  key: 'actions',
}]

page.value = Number.parseInt(route.query.page as any as string) || 1
const { data: titleListRes } = await useFetch('/api/manage/title/titleList', {
  method: 'POST',
  body: JSON.stringify({
    page: page.value,
    size: size.value,
  }),
})

const titleList = computed(() => titleListRes?.value?.titles as any as TitleDTO[])

async function saveTitle() {
  if (!saveState.title.trim()) {
    toast.error('请填写完整,头衔必填字段')
    return
  }
  await $fetch('/api/manage/title/saveTitle', {
    method: 'POST',
    body: JSON.stringify(saveState),
  })
  isOpen.value = false
  await reload(page.value)
  toast.success('保存成功')
}

watch(() => route.fullPath, async () => {
  const page = Number.parseInt(route.query.page as any as string)
  await reload(page)
})

async function reload(page: number) {
  const res = await $fetch('/api/manage/title/titleList', {
    method: 'POST',
    body: JSON.stringify({
      page,
      size: size.value,
    }),
  })
  titleListRes.value = res
}

const statusList = ref([
  { value: true, desc: '启用' },
  { value: false, desc: '禁用' },
])
</script>

<template>
  <UCard class="flex-1">
    <template #header>
      <div class="flex gap-2">
        <UButton @click="doAdd">
          新增头衔
        </UButton>
      </div>
    </template>
    <UTable :rows="titleList" :columns="columns">
      <template #status-data="{ row }">
        {{ row.status ? '启用' : '禁用' }}
      </template>
      <template #actions-data="{ row }">
        <div class="space-x-2">
          <UButton color="white" @click="doEdit(row)">
            编辑
          </UButton>
        </div>
      </template>
      <template #hot-data="{ row }">
        {{ row.hot ? '是' : '否' }}
      </template>
    </UTable>
    <template #footer />
  </UCard>

  <UModal v-model="isOpen">
    <div class="p-4 space-y-4">
      <UFormGroup label="名称" name="name">
        <UInput v-model="saveState.title" />
      </UFormGroup>
      <UFormGroup label="状态" name="status">
        <USelectMenu v-model="saveState.status" value-attribute="value" option-attribute="desc" :options="statusList" />
      </UFormGroup>
      <UFormGroup label="样式" name="style">
        <UTextarea v-model="saveState.style" />
      </UFormGroup>
      <UButton @click="saveTitle">
        提交
      </UButton>
    </div>
  </UModal>
</template>

<style scoped></style>
