<template>
  <UCard class="w-full mt-2" style="min-height: 300px;" :ui="{ body: { padding: 'px-0 sm:p-0' },header:{padding:' py-2 sm:px-4 px-2'} }">    
    <template #header class="py-1">
      <XTagList />
    </template>
    <div class="flex flex-col divide-y divide-gray-100">
      <XPost :showAvatar="true" v-for="post in postList" :key="post.pid" v-bind="post" />
    </div>
    <UPagination size="sm" :to="(page: number) => ({
      query: { page },
    })" class="my-2" v-model="state.page" :page-count="state.size" :total="totalPosts"
      v-if="totalPosts > state.size" />
  </UCard>
</template>

<script lang="ts" setup>
import type { PostDTO } from '~/types';

const route = useRoute()


const state = reactive({
  page: 1,
  size: 20,
  tag: route.params.tag as string
})

state.page = parseInt(route.query.page as any as string)
let { data } = await useFetch('/api/post/list', {
  method: 'POST',
  body: JSON.stringify(state),
})

watch(() => route.fullPath, async () => {
  const page = parseInt(route.query.page as any as string)
  const res = await $fetch('/api/post/list', {
    method: 'POST',
    body: JSON.stringify({
      page, size: state.size,tagName: state.tag
    }),
  })
  data.value = res
})

watch(() => state.page, async () => {
  if(state.page === 1){
    navigateTo('/')
    return
  }
  navigateTo('/?page=' + state.page)
})


const postList = computed(() => {
  return data.value?.posts as any as PostDTO[]
})

const totalPosts = computed(() => {
  return data.value?.total || 0
})
useHead({
  title:`${state.tag}相关的帖子`,
  meta:[
    {name:"keywords",content:"极简论坛"},
    {name:"description",content:"极简论坛"},
  ],
})
</script>

<style></style>