<script setup lang="ts">
import type { CommentDTO } from '~/types'

const props = defineProps({
  username: String,
})

const route = useRoute()

useHead({
  title: `${props.username}的评论`,
  meta: [
    { name: 'keywords', content: '极简论坛' },
    { name: 'description', content: '极简论坛' },
  ],
})

const state = reactive({
  comments: Array<CommentDTO>(),
  total: 0,
  page: 1,
  size: 10,
})
const { data: postRes } = await useFetch<{ total: number, comments: Array<CommentDTO> }>('/api/member/comment', {
  method: 'POST',
  body: { page: state.page, size: state.size, username: props.username },
})

state.comments = postRes.value?.comments || []
state.total = postRes.value?.total || 0

watch(() => route.fullPath, async () => {
  const page = Number.parseInt(route.query.page as any as string)
  const res = await $fetch('/api/member/comment', {
    method: 'POST',
    body: JSON.stringify({
      page,
      size: state.size,
      username: props.username,
    }),
  })
  state.comments = res.comments as any as CommentDTO[]
  state.total = res.total
})

watch(() => state.page, async () => {
  if (state.page === 1) {
    navigateTo(`/member/${props.username}/comment`)
    return
  }
  navigateTo(`/member/${props.username}/comment?page=${state.page}`)
})
const selectedTab = useState('profileSelectedTab', () => 'post')
selectedTab.value = 'comment'
</script>

<template>
  <div v-if="state.comments.length > 0" class="flex flex-col divide-y divide-gray-100 dark:divide-slate-700">
    <XCommentWithPost v-for="comment in state.comments" :key="comment.cid" v-bind="comment" />
  </div>
  <div v-else class="flex items-center text-sm text-gray-500">
    暂无回复
  </div>
  <UPagination
    v-if="state.total > state.size" v-model="state.page" size="sm" :to="(page: number) => ({
      query: { page },
    })" class="my-2" :page-count="state.size"
    :total="state.total"
  />
</template>

<style scoped></style>
