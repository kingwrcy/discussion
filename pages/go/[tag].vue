<script lang="ts" setup>
import type { PostDTO } from '~/types'

const route = useRoute()

const state = reactive({
  page: 1,
  size: 20,
  tag: route.params.tag as string,
})

state.page = Number.parseInt(route.query.page as any as string)
const { data } = await useFetch('/api/post/list', {
  method: 'POST',
  body: JSON.stringify(state),
})

watch(() => route.fullPath, async () => {
  const page = Number.parseInt(route.query.page as any as string)
  const res = await $fetch('/api/post/list', {
    method: 'POST',
    body: JSON.stringify({
      page,
      size: state.size,
      tagName: state.tag,
    }),
  })
  data.value = res
})

watch(() => state.page, async () => {
  if (state.page === 1) {
    navigateTo('/')
    return
  }
  navigateTo(`/?page=${state.page}`)
})

const postList = computed(() => {
  return data.value?.posts as any as PostDTO[]
})

const totalPosts = computed(() => {
  return data.value?.total || 0
})
useHead({
  title: `${state.tag}相关的帖子`,
})
</script>

<template>
  <UCard class="w-full mt-2" style="min-height: 300px;" :ui="{ body: { padding: 'px-0 sm:p-0' }, header: { padding: ' py-2 sm:px-4 px-2' } }">
    <template #header>
      <XTagList :selected="state.tag" />
    </template>
    <div class="flex flex-col divide-y divide-gray-100">
      <XPost v-for="post in postList" :key="post.pid" :show-avatar="true" v-bind="post" />
    </div>
    <UPagination
      v-if="totalPosts > state.size" v-model="state.page" size="sm" :to="(page: number) => ({
        query: { page },
      })" class="my-2" :page-count="state.size"
      :total="totalPosts"
    />
  </UCard>
</template>

<style></style>
