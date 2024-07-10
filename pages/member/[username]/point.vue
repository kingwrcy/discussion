<script lang="ts" setup>
import type { PointReason } from '@prisma/client'
import type { PointHistoryDTO } from '~/types'

const props = defineProps({
  username: String,
})

const route = useRoute()

const columns = [{
  key: 'createdAt',
  label: '时间',
}, {
  key: 'reason',
  label: '事由',
}, {
  key: 'point',
  label: '积分',
}, {
  key: 'post.title',
  label: '帖子',
}, {
  key: 'remark',
  label: '备注',
}]

function getReason(reason: PointReason) {
  switch (reason) {
    case 'POST':
      return '发帖'
    case 'COMMENT':
      return '评论'
    case 'LIKE':
      return '点赞'
    case 'DISLIKE':
      return '点踩'
    case 'SIGNIN':
      return '签到'
    case 'PUNISH':
      return '惩罚'
    case 'INVITE':
      return '生成邀请码'
    case 'SEND':
      return '管理员赠送'
    default:
      return reason
  }
}

const state = reactive({
  page: Number.parseInt(route.query.page as any as string) || 1,
  size: 50,
})

const { data: pointListRes } = await useFetch('/api/member/point', {
  method: 'POST',
  body: JSON.stringify({ ...state, username: props.username }),
})

const pointList = computed(() => pointListRes?.value?.points as any as PointHistoryDTO[])
const total = computed(() => pointListRes?.value?.total as number)

async function reload() {
  const res = await $fetch('/api/member/point', {
    method: 'POST',
    body: JSON.stringify({ ...state, username: props.username }),
  })
  pointListRes.value = res
}

watch(() => route.fullPath, reload)
</script>

<template>
  <div>
    <UTable :rows="pointList" :columns="columns" :ui="{ td: { padding: 'py-2' }, th: { padding: 'py-2' } }">
      <template #createdAt-data="{ row }">
        <div class="whitespace-pre-wrap">
          {{ dateFormat(row.createdAt) }}
        </div>
      </template>
      <template #post.title-data="{ row }">
        <div v-if="row.post" class="max-w-[300px] text-wrap line-clamp-3">
          <NuxtLink class="text-blue-500 whitespace-pre-wrap" :to="`/post/${row.post.pid}`">
            {{ row.post.title }}
          </NuxtLink>
        </div>
      </template>
      <template #point-data="{ row }">
        <div :class="[row.point > 0 ? 'text-green-500' : 'text-red-500']">
          {{ `${row.point > 0 ? '+' : ''}${row.point}` }}
        </div>
      </template>
      <template #reason-data="{ row }">
        {{ getReason(row.reason) }}
      </template>
      <template #empty-state>
        <div class="text-center text-gray-400 my-4 text-sm">
          暂无积分变动
        </div>
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
