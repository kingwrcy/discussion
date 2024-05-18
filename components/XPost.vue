<template>
  <div class="flex space-x-2  items-start py-2" :class="{ 'border-b border-primary/10': !detailPage }">

    <UAvatar v-if="author && author.avatarUrl" :src="getAvatarUrl(author.avatarUrl)" size="md" alt="Avatar" />
    <div class="flex-1 ">
      <div v-if="detailPage" :to="`/post/${props.pid}`" :class="[detailPage ? 'text-lg' : 'text-sm']"
        class="text-gray-600 font-semibold  ">
        <div :class="{ 'line-clamp-1': !detailPage }">{{ title }}</div>
        <!-- <UIcon v-if="props.pinned" name="i-carbon-pin-filled" class="ml-1 text-primary"></UIcon> -->
      </div>
      <NuxtLink v-else :to="`/post/${props.pid}`" :class="[detailPage ? 'text-lg' : 'text-sm']"
        class="text-gray-600 font-semibold   cursor-pointer  hover:text-primary/80">
        <div >{{ title }}</div>
        <!-- <UIcon v-if="props.pinned" name="i-carbon-pin-filled" class="ml-1 text-primary"></UIcon> -->
      </NuxtLink>

      <div class="flex space-x-4 text-[11px] mt-1 text-gray-500">
        <div class="flex items-center space-x-1 cursor-pointer hover:text-primary/50">
          <UIcon name="i-carbon-user" />
          <span>{{ author.username }}</span>
        </div>
        <div class="flex items-center space-x-1 ">
          <UIcon name="i-carbon-view" />
          <span>{{ viewCount }}</span>
        </div>
        <div class="flex items-center space-x-1 cursor-pointer hover:text-primary/50">
          <UIcon name="i-carbon-book" />
          <span>{{ replyCount }}</span>
        </div>
        <div class="flex items-center space-x-1 ">
          <UIcon name="i-carbon-time" />
          <span>{{ $dayjs(createdAt).fromNow() }}</span>
        </div>
      </div>
    </div>

    <div class="flex gap-1 min-w-[120px] justify-end">
      <UBadge color="gray" variant="solid" size="xs" class="cursor-pointer hover:bg-gray-100 self-center"
        v-for="tag in props.tags ">
        {{ tag.name }}</UBadge>
    </div>
  </div>


</template>

<script lang="ts" setup>
import type { PostDTO } from '~/types';
const route = useRoute()
const props = defineProps<PostDTO>()
const detailPage = route.fullPath.startsWith('/post')

</script>

<style scoped></style>