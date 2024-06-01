<template>
  <UCard class="w-full mt-2">
    <template #header class="">
      <div class="flex flex-row gap-2 py-2">
        <UAvatar :src="getAvatarUrl(userinfo.avatarUrl!)" size="lg" alt="Avatar" />
        <div class="flex flex-col text-sm gap-1">
          <div class="flex">
            <NuxtLink :to="`/member/${userinfo.username}`">{{ userinfo.username }}</NuxtLink>
            <UBadge class="ml-1" color="primary" variant="solid" size="xs">{{ userinfo.role === UserRole.ADMIN ? '管理员' : '普通用户' }}
              (lv{{ userinfo.level }})
            </UBadge>
            <UBadge v-if="token && userinfo?.status === 'BANNED'">被禁言,到{{ dateFormat(userinfo?.bannedEnd)}}</UBadge>

          </div>
          <div class="flex gap-1">
            <div class="text-xs text-gray-400">{{ dateFormat(userinfo.createdAt)}}加入</div>
            <div class="text-xs text-gray-400" v-if="userinfo.lastActive">最后活动时间:{{ dateFormat(userinfo.lastActive)}}</div>
          </div> 
        </div>
      </div>
    </template>

    <div class="flex gap-2 mb-4 flex-wrap">
      <NuxtLink class="flex flex-row gap-1 items-center" :to="`/member/${userinfo.username}`">
        <UBadge size="lg" :color="selectedTab === 'post' ? 'primary' : 'white'" variant="solid" class="space-x-1">
          <UIcon name="i-carbon-add-comment" />
          <span>帖子({{ userinfo._count.posts }})</span>
        </UBadge>

      </NuxtLink>

      <NuxtLink class="flex flex-row gap-1 items-center " :to="`/member/${userinfo.username}/comment`">
        <UBadge size="lg" :color="selectedTab === 'comment' ? 'primary' : 'white'" variant="solid" class="space-x-1">
          <UIcon name="i-carbon-book" />
          <span>回复({{ userinfo._count.comments }})</span>
        </UBadge>
      </NuxtLink>

      <NuxtLink class="flex flex-row gap-1 items-center" :to="`/member/${userinfo.username}/fav`" v-if="token">
        <UBadge size="lg" :color="selectedTab === 'fav' ? 'primary' : 'white'" variant="solid" class="space-x-1">
          <UIcon name="i-carbon-favorite" />
          <span>收藏({{ userinfo._count.fav }})</span>
        </UBadge>
      </NuxtLink>

      <NuxtLink class="flex flex-row gap-1 items-center" :to="`/member/${userinfo.username}/point`" v-if="currentUser.username === userinfo.username && token">
        <UBadge size="lg" :color="selectedTab === 'point' ? 'primary' : 'white'" variant="solid" class="space-x-1">
          <UIcon name="i-carbon-favorite" />
          <span>积分({{ userinfo.point }})</span>
        </UBadge>
      </NuxtLink>

      <NuxtLink class="flex flex-row gap-1 items-center" :to="`/member/${userinfo.username}/message`" v-if="currentUser.username === userinfo.username && token">
        <UBadge size="lg" :color="selectedTab === 'message' ? 'primary' : 'white'" variant="solid" class="space-x-1">
          <UIcon name="i-carbon-favorite" />
          <span>消息({{ userinfo._count.ReceiveMessage }})</span>
        </UBadge>
      </NuxtLink>
    </div>

    <NuxtPage :username="userinfo.username" />

  </UCard>
</template>

<script lang="ts" setup>
import { UserRole } from '@prisma/client';
import type { UserDTO } from '~/types';

const config = useRuntimeConfig()
const token = useCookie(config.public.tokenKey)
const route = useRoute()
const username = route.params.username as string
const { data } = await useFetch(`/api/member/${username}`, { method: 'POST' })
const userinfo = data.value as UserDTO
const selectedTab = ref('post')
const currentUser = useState<UserDTO>('userinfo')
useHead({
  title: `${username}的详情`,
  meta: [
    { name: "keywords", content: "极简论坛" },
    { name: "description", content: "极简论坛" },
  ],
})

watch(() => route.fullPath, () => {
  if (route.fullPath.startsWith(`/member/${username}/fav`)) {
    selectedTab.value = 'fav'
  } else if (route.fullPath.startsWith(`/member/${username}/comment`)) {
    selectedTab.value = 'comment'
  } else if (route.fullPath.startsWith(`/member/${username}/point`)) {
    selectedTab.value = 'point'
  } else if (route.fullPath.startsWith(`/member/${username}/message`)) {
    selectedTab.value = 'message'
  } else {
    selectedTab.value = 'post'
  }
}, { immediate: true })
</script>

<style scoped></style>