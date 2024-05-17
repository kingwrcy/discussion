<template>
  <div class="w-full mt-2  text-sm bg-white dark:bg-gray-900 rounded-lg shadow ">
    <div class="px-4 py-2 ">
      <XPost v-bind="post" />
    </div>
    <div class="px-4 pt-2 leading-5 border-t">
      <MdPreview v-model="post.content" preview-theme="github" :editor-id="post.pid" />
    </div>
    <div class="px-4 flex justify-end pb-2 border-b items-center space-x-2">
      <UBadge color="primary" size="xs" class="cursor-pointer hover:bg-primary/80 ">
        <UIcon name="i-carbon-chat" class="mr-1" />加入收藏
      </UBadge>
    </div>

    <div class=" gap-2 divide-y divide-gray-200 dark:divide-gray-800">
      <XComment v-for="(comment, index) in post.comments" :key="comment.cid" v-bind="comment" :index="index" />
      <UPagination class="p-4" :to="(page: number) => ({
        query: { page },
      })" v-model="state.page" :page-count="state.size" :total="totalComments" v-if="totalComments > state.size" />
    </div>
    <div class="px-4 border-t">
      <XReply :pid="post.pid" @commented="refresh" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { PostDTO } from '~/types';
import { MdPreview } from 'md-editor-v3';
import 'md-editor-v3/lib/style.css';

const route = useRoute()
const state = reactive({
  page: 1,
  size: 20
})
const url = '/api/post/' + route.params.pid
let { data, refresh } = await useFetch(url, {
  method: 'POST',
  body: JSON.stringify(state)
})


watch(() => route.fullPath, async () => {
  const page = parseInt(route.query.page as any as string)
  const res = await $fetch(url, {
    method: 'POST',
    body: JSON.stringify({
      page, size: state.size
    }),
  })
  data.value = res
})

watch(() => state.page, async () => {
  if (state.page === 1) {
    navigateTo('/post/'+route.params.pid)
    return
  }
  navigateTo('?page=' + state.page)
})

const post = computed(() => {
  return (data.value as { post: PostDTO }).post
})

const totalComments = computed(() => {
  return post.value._count.comments ?? 0
})


</script>

<style scoped></style>