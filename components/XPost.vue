<template>
  <div class="flex space-x-3  items-start py-2" :class="{ 'sm:px-4 px-2': route.fullPath === '/' }">

    <NuxtLink :to="`/member/${author.username}`" v-if="showAvatar">
      <UAvatar v-if="author && author.avatarUrl" :src="getAvatarUrl(author.avatarUrl)" size="lg" alt="Avatar" />
    </NuxtLink>
    <div class="flex-1">
      <div v-if="detailPage" :to="`/post/${props.pid}`" 
        class="text-gray-600 w-fit">
        <div class="text-2xl" :class="{ 'line-clamp-1': !detailPage }">{{ title }}
        </div>
      </div>
      <NuxtLink v-else :to="`/post/${props.pid}`" 
        class="text-gray-600 flex items-center  cursor-pointer  hover:text-primary/80 w-fit">
        <div>{{ title }}</div>
        <UIcon v-if="props.pinned" name="i-carbon-pin-filled" class="ml-1 text-primary"></UIcon>
      </NuxtLink>

      <div class="flex space-x-4 text-xs mt-1 text-gray-500">
        <div class="font-semibold flex items-center space-x-1 cursor-pointer hover:text-primary/50">
          <UIcon name="i-carbon-user" />
          <NuxtLink :to="`/member/${author.username}`"><span>{{ author.username }}</span></NuxtLink>
        </div>
        <div :to="`/post/${props.pid}`" class="flex items-center space-x-1 text-primary/40">
          <UIcon name="i-carbon-view" />
          <span>{{ viewCount }}</span>
        </div>
        <NuxtLink :to="`/post/${props.pid}`" class="flex items-center space-x-1 text-primary/40 cursor-pointer hover:text-primary/50">
          <UIcon name="i-carbon-book" />
          <span>{{ replyCount }}</span>
        </NuxtLink>
        <div class="flex items-center space-x-1 text-primary/40">
          <UIcon name="i-carbon-time" />
          <span>{{ dateFormatAgo(createdAt) }}</span>
        </div>
      </div>
    </div>
    <UBadge color="gray" variant="solid" size="lg" class="self-start text-xs cursor-pointer hover:bg-gray-100">
      <NuxtLink :to="`/tag/${props.tag.name}`">{{ props.tag.name }}</NuxtLink>
    </UBadge>
  </div>
</template>

<script lang="ts" setup>
import type { PostDTO } from '~/types';

const route = useRoute()
const detailPage = route.fullPath.startsWith('/post')

const props = withDefaults(defineProps<PostDTO & {
  showAvatar: boolean
}>(), {
  showAvatar: true,
  fav: false
})
</script>

<style scoped></style>