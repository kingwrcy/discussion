<template>
  <UCard class="flex-1">
    <template #header>
      <div class="max-w-[300px]">
        <div class="space-y-4">
          <UFormGroup label="用户名" name="username">
            <UInput v-model="state.username" />
          </UFormGroup>
          <UButton type="button" @click="reload">
            查询
          </UButton>
        </div>
      </div>
    </template>
    <UTable :rows="postList" :columns="columns">
      <template #author.avatarUrl-data="{ row }">
        <NuxtLink :to="`/member/${ row.author.username}`">
          <UAvatar :src="getAvatarUrl(row.author.avatarUrl!)" size="lg" alt="Avatar" />
        </NuxtLink>
      </template>
      <template #title-data="{ row }">
        <ULink target="_blank" class="text-blue-500 max-w-[300px] line-clamp-3 text-wrap" :to="`/post/${row.pid}`">{{ row.title }}</ULink>
      </template>
      <template #author.username-data="{ row }">
        <UButton :to="`/member/${ row.author.username}`" color="white">{{ row.author.username }}</UButton>
      </template>
      <template #tags-data="{ row }">
       <div class="space-x-1">
        <UBadge color="gray" variant="solid" class="cursor-pointer hover:bg-gray-100">{{ row.tag.name }}</UBadge>
       </div>
      </template>
      <template #createdAt-data="{ row }">
        {{ dateFormat(row.createdAt)}}
      </template>
      <template #actions-data="{ row }">
        <div class="space-x-2">
          <UButton color="white" @click="doRemove(row)">删除</UButton>
          <UButton color="white" @click="togglePin(row)">{{row.pinned ? '取消' :''}}置顶</UButton>
        </div>
      </template>
    </UTable>
    <template #footer>
      <UPagination size="sm" :to="(page: number) => ({
        query: { page },
      })" class="my-2" v-model="state.page" :page-count="state.size" :total="total" v-if="total > state.size" />
    </template>
  </UCard>
</template>

<script lang="ts" setup>
import { toast } from 'vue-sonner';
import type { PostDTO } from '~/types';

useHead({
  title:"帖子管理",
  meta:[
    {name:"keywords",content:"极简论坛"},
    {name:"description",content:"极简论坛"},
  ],
})
const route = useRoute()
definePageMeta({
  layout: 'backend'
})

const state = reactive({
  page: parseInt(route.query.page as any as string) || 1,
  size: 20,
  begin: undefined,
  end: undefined,
  username: "",
})

const columns = [{
  key: 'author.avatarUrl',
  label: '头像'
}, {
  key: 'author.username',
  label: '用户名称'
}, {
  key: 'title',
  label: '帖子标题',
}, {
  key: 'tags',
  label: '标签'
},{
  key: '_count.comments',
  label: '评论数量',
}, {
  key: 'createdAt',
  label: '创建时间'
},{
  key:'actions'
}]


let { data: postListRes } = await useFetch('/api/manage/post/postList', {
  method: 'POST',
  body: JSON.stringify(state)
})
const doRemove = async (row:PostDTO)=>{
  await $fetch(`/api/manage/post/delete?pid=${row.pid}`, {
    method: 'POST',
  })
  await toast.success('操作成功')
  await reload()
}
const togglePin = async (row:PostDTO)=>{
   await $fetch(`/api/manage/post/togglePin?pid=${row.pid}`, {
    method: 'POST',
  })
  await toast.success('操作成功')
  await reload()
}

const postList = computed(() => postListRes?.value?.posts as any as PostDTO[])
const total = computed(() => postListRes?.value?.total as number)

const reload = async () => {
  const res = await $fetch('/api/manage/post/postList', {
    method: 'POST',
    body: JSON.stringify(state)
  })
  postListRes.value = res
}

watch(() => route.fullPath, reload)
</script>

<style scoped></style>