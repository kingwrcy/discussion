<template>
  <div>
    <UTable :rows="pointList" :columns="columns">
    <template #createdAt-data="{ row }">
      {{ $dayjs(row.createdAt).format('YYYY/MM/DD HH:mm:ss') }}
    </template>
    <template #post.title-data="{ row }">
      <div class="max-w-[300px] text-wrap line-clamp-3" v-if="row.post">
        <NuxtLink :to="`/post/${row.post.pid}`">{{ row.post.title }}</NuxtLink>
      </div>
    </template>
    <template #reason-data="{ row }">
      {{ getReason(row.reason) }}
    </template>
  </UTable>
  <UPagination :to="(page: number) => ({
    query: { page },
  })" class="my-2" v-model="state.page" :page-count="state.size" :total="total" v-if="total > state.size" />
  </div>
</template>

<script lang="ts" setup>
import type { PointReason } from '@prisma/client';
import type { PointHistoryDTO } from '~/types';
const route = useRoute()

const columns = [{
  key: 'createdAt',
  label: '时间'
}, {
  key: 'reason',
  label: '事由'
}, {
  key: 'point',
  label: '积分'
}, {
  key: 'post.title',
  label: '帖子'
}]

const getReason = (reason: PointReason) => {
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
    default:
      return reason
  }
}


const state = reactive({
  page: parseInt(route.query.page as any as string) || 1,
  size: 10,
})

let { data: pointListRes } = await useFetch('/api/member/point', {
  method: 'POST',
  body: JSON.stringify(state)
})

const pointList = computed(() => pointListRes?.value?.points as any as PointHistoryDTO[])
const total = computed(() => pointListRes?.value?.total as number)

const reload = async () => {
  const res = await $fetch('/api/member/point', {
    method: 'POST',
    body: JSON.stringify(state)
  })
  pointListRes.value = res
}

watch(() => route.fullPath, reload)
</script>

<style scoped></style>