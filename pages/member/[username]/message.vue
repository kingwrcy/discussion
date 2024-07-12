<script lang="ts" setup>
import { toast } from 'vue-sonner'
import type { MessageDTO } from '~/types'

const props = defineProps({
  username: String,
})

const route = useRoute()

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
const state = reactive({
  page: Number.parseInt(route.query.page as any as string) || 1,
  size: 50,
})

const { data: messageListRes } = await useFetch('/api/member/message', {
  method: 'POST',
  body: JSON.stringify({ ...state, username: props.username }),
})

const messageList = computed(() => messageListRes?.value?.messages as any as MessageDTO[])
const total = computed(() => messageListRes?.value?.total as number)

async function reload() {
  const res = await $fetch('/api/member/message', {
    method: 'POST',
    body: JSON.stringify({ ...state, username: props.username }),
  })
  messageListRes.value = res
}

async function setMessageRead(id?: number) {
  await $fetch(`/api/member/readMessage?messageId=${id}`, {
    method: 'POST',
  })
  toast.success('操作成功')
  userCardChanged.emit()
  await reload()
}

watch(() => route.fullPath, reload)
</script>

<template>
  <div>
    <div class="flex ">
      <UButton icon="i-carbon-checkmark-outline" color="green" size="xs" @click="setMessageRead()">
        全部已读
      </UButton>
    </div>
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
        <UBadge v-if="!row.read" size="sm">
          未读
        </UBadge>
      </template>
    </UTable>
    <UPagination
      v-if="total > state.size" v-model="state.page" size="sm" :to="(page: number) => ({
        query: { page },
      })" class="my-2" :page-count="state.size" :total="total"
    />
  </div>
</template>

<style scoped></style>
