<template>
  <div class="w-full mt-2  text-sm bg-white dark:bg-gray-900 rounded-lg shadow ">
    <div class="px-4 py-2 ">
      <XPost v-bind="post" />
    </div>
    <div class="px-4 leading-5 ">
      <MdPreview v-model="post.content" preview-theme="github" :editor-id="post.pid" />
    </div>
    <div class="px-4 flex justify-end pb-2 border-b items-center space-x-2">
      <UBadge color="primary" size="xs" class="cursor-pointer hover:bg-primary/80 ">
        <UIcon name="i-carbon-chat" class="mr-1" />加入收藏
      </UBadge>
    </div>

    <div class=" divide-y divide-gray-200 dark:divide-gray-800">
      <XComment v-for="(comment, index) in post.comments" :key="comment.cid" v-bind="comment" :index="index" />
      <UPagination v-model="state.page" :page-count="20" :total="totalComments" v-if="totalComments > 20" />
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
})
const { data, refresh } = await useFetch('/api/post/' + route.params.pid + '?page=' + state.page, {
  method: 'POST'
})

const post = computed(() => {
  return (data.value as { post: PostDTO }).post
})

const totalComments = computed(() => {
  return post.value._count.comments ?? 0
})


</script>

<style scoped></style>