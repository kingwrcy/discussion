<script lang="ts" setup>
import { MdPreview } from 'md-editor-v3'
import type { PostDTO, UserDTO } from '~/types'

const userinfo = useState<UserDTO>('userinfo')
const config = useRuntimeConfig()
const token = useCookie(config.public.tokenKey)
const route = useRoute()
const state = reactive({
  page: 1,
  size: 20,
})

const url = `/api/post/${route.params.pid}`
const { data } = await useFetch(url, {
  method: 'POST',
  body: JSON.stringify({
    ...state,
    count: true,
  }),
})

if (userinfo.value) {
  await userCardChanged.emit()
}

async function reload() {
  const res = await $fetch(url, {
    method: 'POST',
    body: JSON.stringify({
      ...state,
      count: false,
    }),
  })
  data.value = res
}

async function doSupport(pid: string) {
  await $fetch(`/api/post/support?pid=${pid}`, {
    method: 'POST',
  })
  await reload()
}

watch(() => route.fullPath, async () => {
  const page = Number.parseInt(route.query.page as any as string)
  const res = await $fetch(url, {
    method: 'POST',
    body: JSON.stringify({
      page,
      size: state.size,
    }),
  })
  data.value = res
})

watch(() => state.page, async () => {
  if (state.page === 1) {
    navigateTo(`/post/${route.params.pid}`)
    return
  }
  navigateTo(`?page=${state.page}`)
})

async function toggleFav() {
  await $fetch(`/api/post/fav?pid=${route.params.pid}`, {
    method: 'POST',
  })
  await reload()
  userCardChanged.emit()
}

const post = computed(() => {
  return (data.value as { post: PostDTO }).post
})

const totalComments = computed(() => {
  return post.value._count.comments ?? 0
})

useSeoMeta({
  title: post.value.title,
  description: post.value.content.substring(0, 100),
  keywords: post.value.title,
})
const { getAbsoluteUrl } = useAbsoluteUrl()

useHead({
  link: [
    {
      rel: 'canonical',
      href: getAbsoluteUrl(route.path),
    },
  ],
})
</script>

<template>
  <div class="w-full   bg-white dark:bg-gray-900 shadow md:rounded-lg md:mt-2 rounded-none relative">
    <div class="px-4 py-2 ">
      <XPost :show-avatar="true" v-bind="post" @support="doSupport" />
    </div>
    <div class="px-4 pt-2 leading-5 border-t space-y-2 dark:border-slate-700">
      <MdPreview v-model="post.content" :editor-id="post.pid" no-mermaid no-katex />
    </div>

    <div class="px-4 flex justify-end pb-2  items-center space-x-2 my-2">
      <NuxtLink v-if="token && post.uid === userinfo.uid" :to="`/post/new?pid=${post.pid}`">
        <UBadge variant="soft" size="xs" class="flex gap-1 items-center cursor-pointer hover:text-primary/80">
          <UIcon name="i-carbon-edit" />
          <div>编辑</div>
        </UBadge>
      </NuxtLink>
      <UBadge v-if="token" variant="soft" size="xs" class="cursor-pointer hover:text-primary/80" @click="toggleFav">
        <UIcon
          :name="post.fav ? 'i-carbon-favorite-filled' : 'i-carbon-favorite'" class="mr-1"
          :class="[post.fav ? 'text-red-500' : '']"
        />{{ post.fav ? '取消' : '加入' }}收藏
      </UBadge>
    </div>

    <div class=" gap-2 divide-y divide-gray-300 dark:divide-gray-700">
      <XComment v-for="(comment, index) in post.comments" :key="comment.cid" v-bind="comment" :index="index" />
      <UPagination
        v-if="totalComments > state.size" v-model="state.page" size="sm" class="p-4" :to="(page: number) => ({
          query: { page },
        })" :page-count="state.size" :total="totalComments"
      />
    </div>
    <ClientOnly>
      <div v-if="userinfo.status === 'NORMAL' && userinfo.point > 0" class="px-0 md:px-4 border-t dark:border-slate-700">
        <XReply :pid="post.pid" @commented="reload" />
      </div>
    </ClientOnly>

    <XScrollToolbar />
  </div>
</template>

<style scoped></style>
