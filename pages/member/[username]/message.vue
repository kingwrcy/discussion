<template>
  <div>
    <UTable :rows="messageList" :columns="columns">
      <template #createdAt-data="{ row }">
        {{ $dayjs(row.createdAt).format('YYYY/MM/DD HH:mm:ss') }}
      </template>
      <template #content-data="{ row }">
        <div class="max-w-[300px] text-wrap line-clamp-3" v-html="row.content">
        </div>
      </template>
      <template #from.username-data="{ row }">
        <ULink v-if="row.from" class="text-blue-500" :to="`/member/${row.from.username}`">{{ row.from.username }}</ULink>
        <div v-else>系统</div>
      </template>
      <template #actions-data="{ row }">
        <UButton v-if="!row.read">已读</UButton>
      </template>
    </UTable>
    <UPagination :to="(page: number) => ({
      query: { page },
    })" class="my-2" v-model="state.page" :page-count="state.size" :total="total" v-if="total > state.size" />
  </div>
</template>

<script lang="ts" setup>
import type { MessageDTO } from '~/types';
const route = useRoute()

const columns = [{
  key: 'createdAt',
  label: '时间'
}, {
  key: 'from.username',
  label: '发件人'
}, {
  key: 'content',
  label: '内容'
}, {
  key: 'actions'
}]




const state = reactive({
  page: parseInt(route.query.page as any as string) || 1,
  size: 3,
})

let { data: messageListRes } = await useFetch('/api/member/message', {
  method: 'POST',
  body: JSON.stringify(state)
})

const messageList = computed(() => messageListRes?.value?.messages as any as MessageDTO[])
const total = computed(() => messageListRes?.value?.total as number)

const reload = async () => {
  const res = await $fetch('/api/member/message', {
    method: 'POST',
    body: JSON.stringify(state)
  })
  messageListRes.value = res
}

watch(() => route.fullPath, reload)
</script>

<style scoped></style>