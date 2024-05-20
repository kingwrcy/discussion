<template>
  <UCard class="w-full mt-2 divide-y" >
    <template #header class="">
      <div class="flex flex-row gap-2 py-2 border-b">
        <UAvatar :src="getAvatarUrl(userinfo.avatarUrl!)" size="lg" alt="Avatar" />
      <div class="flex flex-col text-sm gap-1">
        <div class="flex">
          <UChip color="green" text="3" size="xl" class="mr-2 text-gray-500">
            <div>{{ userinfo.username }}</div>
          </UChip>
          <UBadge color="green" variant="soft" size="xs">{{ userinfo.role.name }}(lv{{ userinfo.role.level
            }})</UBadge>
        </div>
        <div class="flex gap-1">
          <div class="text-xs text-gray-400">{{ $dayjs(userinfo.createdAt).format('YYYY/MM/DD') }}加入</div>
        </div>
      </div>
      </div>
    </template>

    <UTabs :items="items" class="w-full" @change="changeTab">
    <template #item="{ item }">
    
      <div v-if="item.key === 'post'">post</div>
      <div v-if="item.key === 'comment'">comment</div>
      <div v-if="item.key === 'fav'">fav</div>
    </template>
    </UTabs>
  </UCard>
</template>

<script lang="ts" setup>
import type { UserDTO } from '~/types';

const route = useRoute()
const username = route.params.username as string
const { data } = await useFetch(`/api/user/${username}`, { method: 'POST' })
const userinfo = data.value as UserDTO

const items = [{
  key: 'post',
  label: '帖子',
}, {
  key: 'comment',
  label: '评论',
},{
  key: 'fav',
  label: '收藏',
}]

const changeTab = async (index:number)=>{}
</script>

<style scoped></style>