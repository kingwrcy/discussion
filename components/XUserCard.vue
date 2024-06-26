<script lang="ts" setup>
import { UserRole } from '@prisma/client'
import { toast } from 'vue-sonner'
import { useDebounceFn } from '@vueuse/core'
import type { UserDTO } from '~/types'

const userinfo = useState<UserDTO>('userinfo')

const debouncedFn = useDebounceFn(async () => {
  const res = await $fetch('/api/member/signIn', { method: 'POST' })
  toast.success(res.message)
  if (res.success) {
    userCardChanged.emit()
  }
}, 1000, { maxWait: 5000 })

async function signIn() {
  debouncedFn()
}
</script>

<template>
  <UCard class="w-full mt-2">
    <template #header>
      <div class="flex gap-4 items-center">
        <NuxtLink :to="`/member/${userinfo.username}`">
          <UAvatar
            v-if="userinfo.unRead > 0"
            chip-color="rose"
            :chip-text="userinfo.unRead"
            chip-position="top-right" :src="getAvatarUrl(userinfo.avatarUrl!, userinfo.headImg)" size="lg" alt="Avatar"
          />
          <UAvatar
            v-else :src="getAvatarUrl(userinfo.avatarUrl!, userinfo.headImg)" size="lg" alt="Avatar"
          />
        </NuxtLink>
        <div class="flex flex-col text-sm gap-1">
          <div class="flex justify-between">
            <NuxtLink class="text-base text-primary font-semibold" :to="`/member/${userinfo.username}`">
              {{ userinfo.username }}
            </NuxtLink>

            <UBadge class="ml-1" color="primary" variant="solid" size="xs">
              {{ userinfo.role === UserRole.ADMIN ? '管理员' : '普通用户' }}
              (lv{{ userinfo.level }})
            </UBadge>
          </div>
          <div class="flex gap-1">
            <NuxtLink to="/member/settings">
              <UIcon name="i-carbon-settings" title="设置" class="size-4 cursor-pointer hover:text-primary/90" />
            </NuxtLink>
            <UIcon
              name="i-carbon-checkmark-outline" title="签到" class="size-4 cursor-pointer hover:text-primary/90"
              @click="signIn"
            />
            <div class="ml-auto text-xs text-gray-400">
              {{ dateFormat(userinfo.createdAt, 'YYYY-MM-DD') }}加入
            </div>
          </div>
        </div>
      </div>
    </template>
    <div class="flex flex-row justify-evenly text-primary/80 text-sm">
      <div class="flex flex-col space-y-1">
        <NuxtLink
          :to="`/member/${userinfo.username}/message`" :class="{ 'text-red-500': userinfo.unRead > 0 }"
          class="space-x-1 flex flex-row items-center cursor-pointer"
        >
          <div class="flex items-center gap-1  text-gray-400" :class="{ 'text-red-500': userinfo.unRead > 0 }">
            <UIcon name="i-carbon-notification-filled" />
            <div>未读</div>
          </div>
          <div class="">
            {{ userinfo.unRead }}
          </div>
        </NuxtLink>

        <div
          class="space-x-1 flex flex-row items-center cursor-pointer hover:text-primary/60"
        >
          <div class="flex items-center gap-1 text-gray-400">
            <UIcon name="i-carbon-task-approved" />
            <div>等级</div>
          </div>
          <div class="">
            {{ userinfo.level }}
          </div>
        </div>
      </div>

      <div class="flex flex-col space-y-1">
        <NuxtLink
          :to="`/member/${userinfo.username}`"
          class="space-x-1 flex flex-row items-center cursor-pointer hover:text-primary/60"
        >
          <div class="flex items-center gap-1  text-gray-400">
            <UIcon name="i-carbon-add-comment" />
            <div>发帖</div>
          </div>
          <div class="">
            {{ userinfo.postCount }}
          </div>
        </NuxtLink>

        <NuxtLink
          :to="`/member/${userinfo.username}/fav`"
          class="space-x-1 flex flex-row items-center cursor-pointer hover:text-primary/60"
        >
          <div class="flex items-center gap-1 text-gray-400">
            <UIcon name="i-carbon-favorite" />
            <div>收藏</div>
          </div>
          <div class="">
            {{ userinfo._count.fav }}
          </div>
        </NuxtLink>
      </div>

      <div class="flex flex-col space-y-1">
        <NuxtLink
          :to="`/member/${userinfo.username}/comment`"
          class="space-x-1 flex flex-row items-center cursor-pointer hover:text-primary/60"
        >
          <div class="flex items-center gap-1 text-gray-400">
            <UIcon name="i-carbon-book" />
            <div>回复</div>
          </div>
          <div class="">
            {{ userinfo.commentCount }}
          </div>
        </NuxtLink>
        <NuxtLink
          :to="`/member/${userinfo.username}/point`"
          class="space-x-1 flex flex-row items-center cursor-pointer hover:text-primary/60"
        >
          <div class="flex items-center gap-1 text-gray-400">
            <UIcon name="i-carbon-model" />
            <div>积分</div>
          </div>
          <div class="">
            {{ userinfo.point }}
          </div>
        </NuxtLink>
      </div>
    </div>
  </UCard>
</template>

<style scoped></style>
