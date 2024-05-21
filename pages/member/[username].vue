<template>
  <UCard class="w-full mt-2">
    <template #header class="">
      <div class="flex flex-row gap-2 py-2">
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

    <div class="flex gap-2 mb-4">
      <NuxtLink class="flex flex-row gap-1 items-center" :to="`/member/${userinfo.username}`">
        <UBadge size="lg" :color="selectedTab==='post'? 'gray' : 'white'" variant="solid" class="hover:text-primary/80">
          <UIcon name="i-carbon-add-comment" />
          <span>帖子({{ userinfo._count.posts }})</span>
        </UBadge>

      </NuxtLink>

      <NuxtLink class="flex flex-row gap-1 items-center " :to="`/member/${userinfo.username}/comment`">
        <UBadge size="lg" :color="selectedTab==='comment'? 'gray' : 'white'" variant="solid" class="hover:text-primary/80">
          <UIcon name="i-carbon-book" />
          <span>回复({{ userinfo._count.comments }})</span>
        </UBadge>
      </NuxtLink>

      <NuxtLink class="flex flex-row gap-1 items-center" :to="`/member/${userinfo.username}/fav`" v-if="token">
        <UBadge size="lg" :color="selectedTab==='fav'? 'gray' : 'white'" variant="solid" class="hover:text-primary/80">
          <UIcon name="i-carbon-favorite" />
          <span>收藏(({{ userinfo._count.fav }}))</span>
        </UBadge>
      </NuxtLink>
    </div>

    <NuxtPage :username="userinfo.username" />

  </UCard>
</template>

<script lang="ts" setup>
import type { UserDTO } from '~/types';

const config = useRuntimeConfig()
const token = useCookie(config.public.tokenKey)
const route = useRoute()
const username = route.params.username as string
const { data } = await useFetch(`/api/user/${username}`, { method: 'POST' })
const userinfo = data.value as UserDTO
const selectedTab = useState('profileSelectedTab',()=>'post')




</script>

<style scoped></style>