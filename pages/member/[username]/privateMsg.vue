<script lang="ts" setup>
import type { MessageDTO } from '~/types'

const props = defineProps<{
  username: string
}>()
const route = useRoute()
const state = reactive({
  page: Number.parseInt(route.query.page as any as string) || 1,
  size: 50,
})
const { data: messageListRes } = await useFetch('/api/member/privateMsg', {
  method: 'POST',
  body: JSON.stringify({
    page: 1,
    size: 20,
  }),
})

const messageList = computed(() => messageListRes?.value?.list as any as MessageDTO[])
const total = computed(() => messageListRes?.value?.total as number)

const columns = [{
  key: 'createdAt',
  label: '时间',
}, {
  key: 'from.username',
  label: '来自',
}, {
  key: 'content',
  label: '内容',
}, {
  key: 'actions',
}]
</script>

<template>
  <UTable :rows="messageList" :columns="columns" :ui="{ td: { padding: 'py-3' }, th: { padding: 'py-2' } }">
    <template #createdAt-data="{ row }">
      {{ dateFormat(row.createdAt) }}
    </template>
    <template #content-data="{ row }">
      <div class="text-wrap" v-html="row.content" />
    </template>
    <template #from.username-data="{ row }">
      <ULink v-if="row.from" class="text-blue-500" :to="`/member/${row.from.username}`">
        {{ row.from.username }}
      </ULink>
      <div v-else>
        系统
      </div>
    </template>
    <template #empty-state>
      <div class="text-center text-gray-400 my-4 text-sm">
        暂无消息
      </div>
    </template>
    <template #actions-data="{ row }">
      <UButton v-if="row.type === 'PRIVATE_MSG'" size="xs" :to="`/member/${props.username}/from/${row.from.username}`">
        回复
      </UButton>
    </template>
  </UTable>
  <UPagination
    v-if="total > state.size" v-model="state.page" size="sm" :to="(page: number) => ({
      query: { page },
    })" class="my-2" :page-count="state.size" :total="total"
  />
</template>
