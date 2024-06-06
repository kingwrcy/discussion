<script lang="ts" setup>
import { UserStatus } from '@prisma/client'
import type { UserDTO } from '~/types'

const route = useRoute()
definePageMeta({
  layout: 'backend',
})
const selectedUid = ref('')

async function banUser(day: number) {
  await $fetch('/api/manage/member/banUser', {
    method: 'POST',
    body: JSON.stringify({
      day,
      uid: selectedUid.value,
    }),
  })
  await reload()
}

const items = [
  [{
    label: '一天',
    click: () => { banUser(1) },
  }],
  [{
    label: '三天',
    click: () => { banUser(3) },
  }],
  [{
    label: '一周',
    click: () => { banUser(7) },
  }],
  [{
    label: '一月',
    click: () => { banUser(31) },
  }],
  [{
    label: '永久',
    click: () => { banUser(99999) },
  }],
]

const state = reactive({
  page: Number.parseInt(route.query.page as any as string) || 1,
  size: 20,
  begin: undefined,
  end: undefined,
  username: '',
})

const columns = [{
  key: 'avatarUrl',
  label: '头像',
}, {
  key: 'username',
  label: '用户名称',
}, {
  key: 'role',
  label: '角色',
}, {
  key: 'email',
  label: '邮箱',
}, {
  key: 'createdAt',
  label: '加入时间',
}, {
  key: 'lastLogin',
  label: '最后登录时间',
}, {
  key: 'bannedEnd',
  label: '禁言结束时间',
}, {
  key: 'point',
  label: '积分',
}, {
  key: '_count.posts',
  label: '帖子数量',
}, {
  key: '_count.comments',
  label: '评论数量',
}, {
  key: 'actions',
}]

async function revokeBanned(row: UserDTO) {
  await $fetch('/api/manage/member/revokeBanUser', {
    method: 'POST',
    body: JSON.stringify({
      uid: row.uid,
    }),
  })
  await reload()
}

const { data: userListRes } = await useFetch('/api/manage/userList', {
  method: 'POST',
  body: JSON.stringify(state),
})
const userList = computed(() => userListRes?.value?.users as any as UserDTO[])
const total = computed(() => userListRes?.value?.total as number)

async function reload() {
  const res = await $fetch('/api/manage/userList', {
    method: 'POST',
    body: JSON.stringify(state),
  })
  userListRes.value = res
}

watch(() => route.fullPath, reload)
</script>

<template>
  <UCard class="flex-1 overflow-hidden">
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
    <UTable :rows="userList" :columns="columns" class="overflow-auto w-full" :ui="{ wrapper: 'w-[300px]', th: { base: 'text-nowrap' } }">
      <template #avatarUrl-data="{ row }">
        <NuxtLink :to="`/member/${row.username}`">
          <UAvatar :src="getAvatarUrl(row.avatarUrl!, row.headImg)" size="lg" alt="Avatar" />
        </NuxtLink>
      </template>
      <template #username-data="{ row }">
        <UButton :to="`/member/${row.username}`" color="white">
          {{ row.username }}
        </UButton>
      </template>
      <template #createdAt-data="{ row }">
        {{ dateFormat(row.createdAt) }}
      </template>
      <template #lastLogin-data="{ row }">
        {{ dateFormat(row.lastLogin) }}
      </template>
      <template #bannedEnd-data="{ row }">
        {{ row.bannedEnd && dateFormat(row.bannedEnd) }}
      </template>
      <template #actions-data="{ row }">
        <div class="space-x-2">
          <UDropdown
            v-if="row.status === UserStatus.NORMAL" :items="items" :popper="{ placement: 'bottom-start' }"
            :ui="{ width: 'w-20' }"
          >
            <UButton
              color="white" label="禁言" trailing-icon="i-heroicons-chevron-down-20-solid"
              @click="selectedUid = row.uid"
            />
          </UDropdown>
          <UButton v-else color="white" label="撤销禁言" @click="revokeBanned(row)" />
        </div>
      </template>
    </UTable>
    <template #footer>
      <UPagination
        v-if="total > state.size" v-model="state.page" size="sm" :to="(page: number) => ({
          query: { page },
        })" class="my-2" :page-count="state.size" :total="total"
      />
    </template>
  </UCard>
</template>

<style scoped></style>
