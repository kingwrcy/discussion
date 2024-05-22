<template>
  <div class="flex flex-col divide-y divide-gray-100" v-if="state.comments.length > 0">
    <XCommentWithPost  v-for="comment in state.comments" :key="comment.cid" v-bind="comment" />
  </div>
  <div class="flex items-center text-sm text-gray-500" v-else>
    暂无评论
  </div>
  <UPagination :to="(page: number) => ({
    query: { page },
  })" class="my-2" v-model="state.page" :page-count="state.size" :total="state.total"
    v-if="state.total > state.size" />
</template>

<script setup lang="ts">
import type { CommentDTO, PostDTO } from '~/types';
const route = useRoute()

const props = defineProps({
  username: String
})
const state = reactive({
  comments: Array<CommentDTO>(),
  total: 0,
  page: 1,
  size: 10
})
const { data: postRes } = await useFetch<{ total: number, comments: Array<CommentDTO> }>('/api/member/comment',
  {
    method: 'POST',
    body: { page: state.page, size: state.size, username: props.username }
  })

state.comments = postRes.value?.comments || []
state.total = postRes.value?.total || 0


watch(() => route.fullPath, async () => {
  const page = parseInt(route.query.page as any as string)
  const res = await $fetch('/api/member/comment', {
    method: 'POST',
    body: JSON.stringify({
      page, size: state.size, username: props.username
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
const selectedTab = useState('profileSelectedTab',()=>'post')
selectedTab.value = 'comment'
</script>

<style scoped></style>