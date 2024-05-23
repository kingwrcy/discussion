<template>
  <UCard class="w-full mt-2">
    <template #header>
      <div class="flex gap-4 items-center">
        <NuxtLink :to="`/member/${userinfo.username}`">
          <UAvatar :src="getAvatarUrl(userinfo.avatarUrl!)" size="lg" alt="Avatar" />
        </NuxtLink>
        <div class="flex flex-col text-sm gap-1">
          <div class="flex justify-between">
            <UChip :text="userinfo.unRead" size="2xl" v-if="userinfo.unRead">
              <NuxtLink :to="`/member/${userinfo.username}`">{{ userinfo.username }}</NuxtLink>
            </UChip>
            <NuxtLink :to="`/member/${userinfo.username}`" v-else>{{ userinfo.username }}</NuxtLink>
            <UBadge color="primary" variant="solid" size="xs">{{ userinfo.role === UserRole.ADMIN ? '管理员' : '普通用户' }}
              (lv{{ userinfo.level }})
            </UBadge>
          </div>
          <div class="flex gap-1">
            <NuxtLink :to="`/member/settings`">
              <UIcon name="i-carbon-settings" title="设置" class="size-4 cursor-pointer hover:text-primary/90" />
            </NuxtLink>
            <UIcon @click="signIn" name="i-carbon-checkmark-outline" title="签到"
              class="size-4 cursor-pointer hover:text-primary/90" />
            <div class="ml-auto text-xs text-gray-400">{{ $dayjs(userinfo.createdAt).format('YYYY/MM/DD') }}加入</div>
          </div>
        </div>
      </div>
    </template>
    <div class="flex flex-col justify-evenly text-primary/80 text-sm">
      <div class="flex flex-row space-x-4 justify-evenly">
        <NuxtLink :to="`/member/${userinfo.username}`"
          class="space-x-2 flex flex-row items-center cursor-pointer hover:text-primary/60">
          <div class="flex items-center gap-1  text-gray-400">
            <UIcon name="i-carbon-add-comment" />
            <div>发帖</div>
          </div>
          <div class="">{{ userinfo.postCount }}</div>

        </NuxtLink>
        <NuxtLink :to="`/member/${userinfo.username}/comment`"
          class="space-x-2 flex flex-row items-center cursor-pointer hover:text-primary/60">
          <div class="flex items-center gap-1 text-gray-400">
            <UIcon name="i-carbon-book" />
            <div>回复</div>
          </div>
          <div class="">{{ userinfo.commentCount }}</div>
        </NuxtLink>
      </div>

      <div class="flex flex-row space-x-4 justify-evenly">
        <NuxtLink :to="`/member/${userinfo.username}/fav`"
          class="space-x-2 flex flex-row items-center cursor-pointer hover:text-primary/60">
          <div class="flex items-center gap-1 text-gray-400">
            <UIcon name="i-carbon-favorite-filled" class="text-red-500" />
            <div>收藏</div>
          </div>
          <div class="">{{ userinfo._count.fav }}</div>

        </NuxtLink>
        <NuxtLink :to="`/member/${userinfo.username}/point`"
          class="space-x-2 flex flex-row items-center cursor-pointer hover:text-primary/60">
          <div class="flex items-center gap-1 text-gray-400">
            <UIcon name="i-carbon-favorite" class="text-red-500" />
            <div>积分</div>
          </div>
          <div class="">{{ userinfo.point }}</div>
        </NuxtLink>
      </div>
    </div>
  </UCard>
</template>

<script lang="ts" setup>
import { UserRole } from '@prisma/client';
import { toast } from 'vue-sonner';
import type { UserDTO } from '~/types';
import { useDebounceFn } from '@vueuse/core'

const userinfo = useState<UserDTO>('userinfo')

const debouncedFn = useDebounceFn(async () => {
  const res = await $fetch('/api/member/signIn', { method: 'POST' })
  toast.success(res.message)
  if (res.success) {
    userCardChanged.emit()
  }
}, 1000, { maxWait: 5000 })

const signIn = async () => {
  debouncedFn()
}
</script>

<style scoped></style>