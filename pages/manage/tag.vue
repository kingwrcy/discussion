<template>
  <UCard class="flex-1">
    <template #header>
      <UButton @click="doAdd">新增标签</UButton>
    </template>
    <UTable :rows="state.tagList" :columns="columns">
      <template #avatarUrl-data="{ row }">
        <NuxtLink :to="`/member/${row.username}`">
          <UAvatar :src="getAvatarUrl(row.avatarUrl!)" size="lg" alt="Avatar" />
        </NuxtLink>
      </template>
      <template #actions-data="{row}">
        <UButton color="white" @click="doEdit(row)">编辑</UButton>
      </template>

    </UTable>
    <template #footer>
      <UPagination :to="(page: number) => ({
        query: { page },
      })" class="my-2" v-model="state.page" :page-count="state.size" :total="state.total"
        v-if="state.total > state.size" />
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
        <UButton>提交</UButton>
      </div>
    </UModal>
</template>

<script lang="ts" setup>
import type { TagDTO } from '~/types';
const route = useRoute()
definePageMeta({
  layout: 'backend'
})

const state = reactive({
  tagList: Array<TagDTO>(),
  page: 1,
  size: 20,
  begin: undefined,
  end: undefined,
  total: 0
})

const saveState = reactive({
  name: '',
  desc: ''
})

const isOpen = ref(false)

const doEdit = (row:TagDTO)=>{
  saveState.name = row.name
  saveState.desc = row.desc
  isOpen.value = true
}

const doAdd = ()=>{
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
  key: 'count',
  label: '帖子数量',
}, {
  key: 'actions'
}]


const { data } = useFetch('/api/manage/tagList', {
  method: 'POST',
  body: JSON.stringify(state)
})
state.tagList = data.value?.tags as any as TagDTO[]
state.total = data.value?.total || 0

watch(() => route.fullPath, async () => {
  const page = parseInt(route.query.page as any as string)
  const res = await $fetch('/api/manage/tagList', {
    method: 'POST',
    body: JSON.stringify({
      page, size: state.size
    }),
  })
  state.tagList = res.tags as any as TagDTO[]
  state.total = res.total
})

watch(() => state.page, async () => {
  if (state.page === 1) {
    navigateTo('/manage')
    return
  }
  navigateTo('/manage?page=' + state.page)
})

</script>

<style scoped></style>