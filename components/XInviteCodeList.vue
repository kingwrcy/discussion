<script lang="ts" setup>
import { toast } from 'vue-sonner'
import type { inviteInfo } from '~/types'

const { copy } = useClipboard()
const state = reactive({
  page: 1,
  size: 10,
})

function copyCode(code: string) {
  copy(code)
  toast.success('复制成功')
}

const columns = [{
  key: 'createdAt',
  label: '生成时间',
}, {
  key: 'endAt',
  label: '有效时间',
}, {
  key: 'content',
  label: '邀请码',
}, {
  key: 'toUser.username',
  label: '使用人',
}]

const { data: res } = await useFetch('/api/member/inviteCodeList', {
  method: 'POST',
  body: JSON.stringify(state),
})
const inviteCodeList = computed(() => res?.value?.list as any as inviteInfo[])
const total = computed(() => res?.value?.total as number)
</script>

<template>
  <UCard class="flex-1 overflow-hidden">
    <UTable
      :rows="inviteCodeList" :columns="columns" class="overflow-auto w-full"
      :ui="{ wrapper: 'w-[300px]', th: { base: 'text-nowrap' } }"
    >
      <template #content-data="{ row }">
        <UButton size="xs" icon="i-heroicons-clipboard-document" color="gray" @click="copyCode(row.content)">
          点我复制
        </UButton>
      </template>
      <template #toUser.username-data="{ row }">
        <ULink
          v-if="row.toUser"
          class="text-green-500" :to="`/member/${row.toUser.username}`"
        >
          {{ row.toUser.username }}
        </ULink>
      </template>
      <template #createdAt-data="{ row }">
        {{ dateFormat(row.createdAt) }}
      </template>
      <template #endAt-data="{ row }">
        {{ dateFormat(row.endAt) }}
      </template>
    </UTable>
    <template #footer>
      <UPagination
        v-if="total > state.size" v-model="state.page" size="sm" :to="(page: number) => ({
          query: { page },
        })" class="my-2" :page-count="state.size" :total="total"
      />
    </template>
  </UCard>
</template>

<style scoped></style>
