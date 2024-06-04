<script setup lang="ts">
import type { PostDTO } from '~/types'

const props = defineProps({
  username: String,
})

const route = useRoute()

useHead({
  title: `${props.username}的帖子`,
  meta: [
    { name: 'keywords', content: '极简论坛' },
    { name: 'description', content: '极简论坛' },
  ],
})

const state = reactive({
  posts: Array<PostDTO>(),
  total: 0,
  page: 1,
  size: 10,
})
const { data: postRes } = await useFetch<{ total: number, posts: Array<PostDTO> }>('/api/member/post', {
  method: 'POST',
  body: { page: state.page, size: state.size, username: props.username },
})

state.posts = postRes.value?.posts || []
state.total = postRes.value?.total || 0

watch(() => route.fullPath, async () => {
  const page = Number.parseInt(route.query.page as any as string)
  const res = await $fetch('/api/member/post', {
    method: 'POST',
    body: JSON.stringify({
      page,
      size: state.size,
      username: props.username,
    }),
  })
  state.posts = res.posts as any as PostDTO[]
  state.total = res.total
})

watch(() => state.page, async () => {
  if (state.page === 1) {
    navigateTo(`/member/${props.username}`)
    return
  }
  navigateTo(`/member/${props.username}?page=${state.page}`)
})
const selectedTab = useState('profileSelectedTab', () => 'post')
selectedTab.value = 'post'
</script>

<template>
  <div v-if="state.posts.length > 0" class="flex flex-col divide-y divide-gray-100 dark:divide-slate-700">
    <XPost v-for="post in state.posts" :key="post.pid" :show-avatar="false" v-bind="post" />
  </div>
  <div v-else class="flex items-center text-sm text-gray-500">
    暂无帖子
  </div>
  <UPagination
    v-if="state.total > state.size" v-model="state.page" size="sm" :to="(page: number) => ({
      query: { page },
    })" class="my-2" :page-count="state.size"
    :total="state.total"
  />
</template>

<style scoped></style>
