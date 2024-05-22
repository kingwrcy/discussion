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
    <UTable :rows="userList" :columns="columns">
      <template #avatarUrl-data="{ row }">
        <NuxtLink :to="`/member/${row.username}`">
          <UAvatar :src="getAvatarUrl(row.avatarUrl!)" size="lg" alt="Avatar" />
        </NuxtLink>
      </template>
      <template #username-data="{ row }">
        <UButton :to="`/member/${row.username}`" color="white">{{ row.username }}</UButton>
      </template>
      <template #createdAt-data="{ row }">
        {{ $dayjs(row.createdAt).format('YYYY/MM/DD HH:mm:ss') }}
      </template>
      <template #lastLogin-data="{ row }">
        {{ $dayjs(row.lastLogin).format('YYYY/MM/DD HH:mm:ss') }}
      </template>
      <template #actions-data="{ row }">
        <div class="space-x-2">
          <UButton color="white" @click="doRemove(row)">禁言</UButton>
        </div>
      </template>
    </UTable>
    <template #footer>
      <UPagination :to="(page: number) => ({
        query: { page },
      })" class="my-2" v-model="state.page" :page-count="state.size" :total="total"
        v-if="total > state.size" />
    </template>
  </UCard>
</template>

<script lang="ts" setup>
import type { UserDTO } from '~/types';
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
  key: 'avatarUrl',
  label: '头像'
}, {
  key: 'username',
  label: '用户名称'
}, {
  key: 'role',
  label: '角色',
}, {
  key: 'email',
  label: '邮箱'
}, {
  key: 'createdAt',
  label: '加入时间'
}, {
  key: 'lastLogin',
  label: '最后登录时间',
}, {
  key: 'point',
  label: '积分'
}, {
  key: '_count.posts',
  label: '帖子数量',
}, {
  key: '_count.comments',
  label: '评论数量',
},{
  key:'actions'
}]

const doRemove = async (row:UserDTO)=>{}

let { data:userListRes } = await useFetch('/api/manage/userList', {
  method: 'POST',
  body: JSON.stringify(state)
})
const userList = computed(() => userListRes?.value?.users as any as UserDTO[])
const total = computed(() => userListRes?.value?.total as number)

const reload = async () => {
  const res = await $fetch('/api/manage/userList', {
    method: 'POST',
    body: JSON.stringify(state)
  })
  userListRes.value = res
}

watch(() => route.fullPath,reload)
</script>

<style scoped></style>