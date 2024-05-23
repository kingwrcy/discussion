<template>
  <div class="flex flex-col" v-if="state.posts.length > 0">
    <XPost :show-avatar="false" v-for="post in state.posts" :key="post.pid" v-bind="post" />
  </div>
  <div class="flex items-center text-sm text-gray-500" v-else>
    暂无收藏
  </div>
  <UPagination size="sm" :to="(page: number) => ({
    query: { page },
  })" class="my-2" v-model="state.page" :page-count="state.size" :total="state.total"
    v-if="state.total > state.size" />
</template>

<script setup lang="ts">

import type { PostDTO } from '~/types';
const route = useRoute()

const props = defineProps({
  username: String
})

useHead({
  title:`${props.username}的收藏`,
  meta:[
    {name:"keywords",content:"极简论坛"},
    {name:"description",content:"极简论坛"},
  ],
})

const state = reactive({
  posts: Array<PostDTO>(),
  total: 0,
  page: 1,
  size: 10
})
const { data: postRes } = await useFetch<{ total: number, posts: Array<PostDTO> }>('/api/member/fav',
  {
    method: 'POST',
    body: { page: state.page, size: state.size, username: props.username }
  })

state.posts = postRes.value?.posts || []
state.total = postRes.value?.total || 0


watch(() => route.fullPath, async () => {
  const page = parseInt(route.query.page as any as string)
  const res = await $fetch('/api/member/fav', {
    method: 'POST',
    body: JSON.stringify({
      page, size: state.size, username: props.username
    }),
  })
  state.posts = res.posts as any as PostDTO[]
  state.total = res.total
})

watch(() => state.page, async () => {
  if (state.page === 1) {
    navigateTo(`/member/${props.username}/fav`)
    return
  }
  navigateTo(`/member/${props.username}/fav?page=${state.page}`)
})
const selectedTab = useState('profileSelectedTab',()=>'post')
selectedTab.value = 'fav'
</script>

<style scoped></style>