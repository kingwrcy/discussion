<template>
  <UCard class="flex-1">
    <template #header>
      <div class="max-w-[300px]">
        <div class="space-y-4">
          <div class="flex flex-row gap-4">
            <UFormGroup label="用户名" name="username">
              <UInput v-model="state.username" />
            </UFormGroup>
            <UFormGroup label="帖子PID" name="pid">
              <UInput v-model="state.pid" />
            </UFormGroup>
          </div>
          <UButton type="button" @click="reload">
            查询
          </UButton>
        </div>
      </div>
    </template>
    <UTable :rows="commentList" :columns="columns">
      <template #author.avatarUrl-data="{ row }">
        <NuxtLink :to="`/member/${row.author.username}`">
          <UAvatar :src="getAvatarUrl(row.author.avatarUrl!)" size="lg" alt="Avatar" />
        </NuxtLink>
      </template>
      <template #author.username-data="{ row }">
        <UButton :to="`/member/${row.author.username}`" color="white">{{ row.author.username }}</UButton>
      </template>
      <template #post.title-data="{ row }">
        <ULink target="_blank" class="text-blue-500 max-w-[300px] line-clamp-3 text-wrap" :to="`/post/${row.pid}`">{{ row.post.title }}</ULink>
      </template>
      <template #content-data="{ row }">
        <div class="max-w-[300px] line-clamp-3 text-wrap" :title="row.content">
            {{ row.content }}         
        </div>
      </template>
      <template #createdAt-data="{ row }">
        {{ $dayjs(row.createdAt).format('YYYY/MM/DD HH:mm:ss') }}
      </template>
      <template #actions-data="{ row }">
        <div class="space-x-2">
          <UButton color="white" @click="doRemove(row)">删除</UButton>
        </div>
      </template>
    </UTable>
    <template #footer>
      <UPagination :to="(page: number) => ({
        query: { page },
      })" class="my-2" v-model="state.page" :page-count="state.size" :total="total" v-if="total > state.size" />
    </template>
  </UCard>
</template>

<script lang="ts" setup>
import type { CommentDTO } from '~/types';
const route = useRoute()
definePageMeta({
  layout: 'backend'
})

const state = reactive({
  page: parseInt(route.query.page as any as string) || 1,
  size: 20,
  begin: undefined,
  end: undefined,
  pid: "",
  username: "",
})

const columns = [{
  key: 'author.avatarUrl',
  label: '头像'
}, {
  key: 'author.username',
  label: '用户名称'
}, {
  key: 'post.title',
  label: '帖子标题',
}, {
  key: 'content',
  label: '评论内容'
}, {
  key: 'createdAt',
  label: '创建时间'
}, {
  key: 'actions'
}]


const doRemove = async (row:CommentDTO)=>{}
let { data: commentListRes } = await useFetch('/api/manage/commentList', {
  method: 'POST',
  body: JSON.stringify(state)
})

const commentList = computed(() => commentListRes?.value?.comments as any as CommentDTO[])
const total = computed(() => commentListRes?.value?.total as number)

const reload = async () => {
  const res = await $fetch('/api/manage/commentList', {
    method: 'POST',
    body: JSON.stringify(state)
  })
  commentListRes.value = res
}

watch(() => route.fullPath, reload)
</script>

<style scoped></style>