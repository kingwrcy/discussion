<template>
  <UCard class="w-full mt-2">
    <template #header>
      <div class="flex gap-4 items-center">
        <NuxtLink :to="`/member/${userinfo.username}`">
          <UAvatar :src="getAvatarUrl(userinfo.avatarUrl!)" size="lg" alt="Avatar" />
        </NuxtLink>
        <div class="flex flex-col text-sm gap-1">
          <div class="flex justify-between">
              <NuxtLink :to="`/member/${userinfo.username}`">{{ userinfo.username }}</NuxtLink>
            <UBadge color="green" variant="soft" size="xs">{{ userinfo.role.name }}(lv{{ userinfo.role.level }})
            </UBadge>
          </div>
          <div class="flex gap-1">
            <NuxtLink :to="`/member/settings`"><UIcon name="i-carbon-settings" title="设置" class="size-4 cursor-pointer hover:text-primary/90" /></NuxtLink>
            <UIcon name="i-carbon-checkmark-outline" title="签到" class="size-4 cursor-pointer hover:text-primary/90" />
            <div class="ml-auto text-xs text-gray-400">{{ $dayjs(userinfo.createdAt).format('YYYY/MM/DD') }}加入</div>
          </div>
        </div>
      </div>
    </template>
    <div class="flex flex-2 gap-4 justify-evenly text-primary/80 text-sm">
      <NuxtLink :to="`/member/${userinfo.username}`" class="flex flex-col  items-center cursor-pointer hover:text-primary/60">
        <div class="text-base">{{ userinfo.postCount }}</div>
        <div class="flex items-center gap-1  text-gray-400">
          <UIcon name="i-carbon-add-comment" />
          <div>发帖</div>
        </div>
      </NuxtLink>
      <NuxtLink :to="`/member/${userinfo.username}/comment`" class="flex flex-col items-center cursor-pointer hover:text-primary/60">
        <div class="text-base">{{ userinfo.commentCount }}</div>
        <div class="flex items-center gap-1 text-gray-400">
          <UIcon name="i-carbon-book" />
          <div>回复</div>
        </div>
      </NuxtLink>
      <NuxtLink :to="`/member/${userinfo.username}/fav`" class="flex flex-col items-center cursor-pointer hover:text-primary/60">
        <div class="text-base">{{ userinfo._count.fav }}</div>
        <div class="flex items-center gap-1 text-gray-400">
          <UIcon name="i-carbon-favorite-filled" class="text-red-500" />
          <div>收藏</div>
        </div>
      </NuxtLink>
    </div>
  </UCard>
</template>

<script lang="ts" setup>
import type { UserDTO } from '~/types';

const userinfo = useState<UserDTO>('userinfo')
</script>

<style scoped></style>