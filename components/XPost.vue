<template>
  <div class="flex space-x-2  items-start py-2">

    <NuxtLink :to="`/member/${author.username}`" v-if="showAvatar">
      <UAvatar v-if="author && author.avatarUrl" :src="getAvatarUrl(author.avatarUrl)" size="md" alt="Avatar" />
    </NuxtLink>
    <div class="flex-1 ">
      <div v-if="detailPage" :to="`/post/${props.pid}`" :class="[detailPage ? 'text-lg' : 'text-sm']"
        class="text-gray-600 font-semibold  ">
        <div :class="{ 'line-clamp-1': !detailPage }">{{ title }}</div>
        <!-- <UIcon v-if="props.pinned" name="i-carbon-pin-filled" class="ml-1 text-primary"></UIcon> -->
      </div>
      <NuxtLink v-else :to="`/post/${props.pid}`" :class="[detailPage ? 'text-lg' : 'text-sm']"
        class="text-gray-600 font-semibold   cursor-pointer  hover:text-primary/80">
        <div>{{ title }}</div>
        <!-- <UIcon v-if="props.pinned" name="i-carbon-pin-filled" class="ml-1 text-primary"></UIcon> -->
      </NuxtLink>

      <div class="flex space-x-4 text-[11px] mt-1 text-gray-500">
        <div class="flex gap-1 ">
          <UBadge color="gray" variant="solid" size="xs" class="cursor-pointer hover:bg-gray-100 self-center"
            v-for="tag in tags ">
            <NuxtLink :to="`/tag/${tag.name}`">{{ tag.name }}</NuxtLink></UBadge>
        </div>
        <div class="flex items-center space-x-1 cursor-pointer hover:text-primary/50">
          <UIcon name="i-carbon-user" />
          <NuxtLink :to="`/member/${author.username}`"><span>{{ author.username }}</span></NuxtLink>
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