<template>
  <div class="w-full mt-2  text-sm bg-white dark:bg-gray-900 rounded-lg shadow ">
    <div class="px-4 py-2 ">
      <XPost :show-avatar="true" v-bind="post" />
    </div>
    <div class="px-4 pt-2 leading-5 border-t">
      <MdPreview v-model="post.content" :editor-id="post.pid" />
    </div>
    <div class="px-4 flex justify-end pb-2 border-b items-center space-x-2">
      <NuxtLink :to="`/post/new?pid=${post.pid}`" v-if="token && post.uid === userinfo.uid">
        <UBadge variant="soft" size="xs" class="flex gap-1 items-center cursor-pointer hover:text-primary/80">
          <UIcon name="i-carbon-edit" />
          <div>编辑</div>
        </UBadge>
      </NuxtLink>
      <UBadge variant="soft" size="xs" class="cursor-pointer hover:text-primary/80" @click="toggleFav">
        <UIcon :name="post.fav ? 'i-carbon-favorite-filled' : 'i-carbon-favorite'" class="mr-1"
          :class="[post.fav ? 'text-red-500' : '']" />{{ post.fav ? '取消' : '加入' }}收藏
      </UBadge>
    </div>

    <div class=" gap-2 divide-y divide-gray-200 dark:divide-gray-800">
      <XComment v-for="(comment, index) in post.comments" :likeCount="post._count.commentLike"
        :dislikeCount="post._count.commentDisLike" :key="comment.cid" v-bind="comment" :index="index" />
      <UPagination class="p-4" :to="(page: number) => ({
        query: { page },
      })" v-model="state.page" :page-count="state.size" :total="totalComments" v-if="totalComments > state.size" />
    </div>
    <div class="px-4 border-t" v-if="userinfo.status === 'NORMAL'">
      <XReply :pid="post.pid" @commented="refresh" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { PostDTO, UserDTO } from '~/types';
import { MdPreview } from 'md-editor-v3';
import 'md-editor-v3/lib/style.css';
let userinfo = useState<UserDTO>('userinfo')
const config = useRuntimeConfig()
const token = useCookie(config.public.tokenKey)
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
    navigateTo('/post/' + route.params.pid)
    return
  }
  navigateTo('?page=' + state.page)
})

const toggleFav = async () => {
  await $fetch('/api/post/fav?pid=' + post.value.pid, {
    method: 'POST'
  })
  await refresh()
  userCardChanged.emit()
}

const post = computed(() => {
  return (data.value as { post: PostDTO }).post
})

const totalComments = computed(() => {
  return post.value._count.comments ?? 0
})


</script>

<style scoped></style>