<template>
  <UCard class="w-full mt-2">
    <template #header>
      <div class="flex gap-4 items-center">
        <UAvatar :src="getAvatarUrl(userinfo.avatarUrl!)" size="lg" alt="Avatar" />
        <div class="flex flex-col text-sm gap-1">
          <div class="flex justify-between">
            <UChip color="green" text="3" size="xl" class="mr-2 text-gray-500"><div>{{ userinfo.username }}</div></UChip>
            <UBadge color="green" variant="soft" size="xs">{{ userinfo.role.name }}(lv{{  userinfo.role.level }})</UBadge>
          </div>
          <div class="flex gap-1">
            <UIcon name="i-carbon-settings" title="设置" class="size-4 cursor-pointer hover:text-primary/90" />
            <UIcon name="i-carbon-checkmark-outline" title="签到" class="size-4 cursor-pointer hover:text-primary/90" />
            <div class="ml-auto text-xs text-gray-400">{{ $dayjs(userinfo.createdAt).format('YYYY/MM/DD') }}加入</div>
          </div>
        </div>
      </div>
    </template>
    <div class="flex flex-2 gap-4 justify-evenly text-primary/80 text-sm">
      <div class="flex flex-col  items-center cursor-pointer hover:text-primary/60">        
        <div class="text-base">{{ userinfo.postCount }}</div>
        <div class="flex items-center gap-1  text-gray-400">
          <UIcon name="i-carbon-add-comment" />
          <div>发帖</div>
        </div>
      </div>
      <div class="flex flex-col items-center cursor-pointer hover:text-primary/60">
        <div class="text-base">{{ userinfo.commentCount }}</div>
        <div class="flex items-center gap-1 text-gray-400">
          <UIcon name="i-carbon-book" />
          <div>回复</div>
        </div>    
      </div>
      <div class="flex flex-col items-center cursor-pointer hover:text-primary/60">
        <div class="text-base">{{ userinfo._count.fav }}</div>
        <div class="flex items-center gap-1 text-gray-400">
          <UIcon name="i-carbon-favorite" />
          <div>收藏</div>
        </div>
      </div>
      
    </div>
  </UCard>
</template>

<script lang="ts" setup>
import type { UserDTO } from '~/types';

const userinfo = useState<UserDTO>('userinfo')
</script>

<style scoped></style>