<template>
  <div class="flex space-x-2  items-start py-2 border-b border-primary/10">

    <UAvatar :src="author.avatarUrl??''" size="md" alt="Avatar" />
    <div class="flex-1">
      <NuxtLink :to="`/post/${props.id}`" class="text-gray-600 font-semibold text-sm truncate cursor-pointer hover:text-primary/80">
        <span>{{title}}</span>
        <!-- <UIcon v-if="props.pinned" name="i-carbon-pin-filled" class="ml-1 text-primary"></UIcon> -->
      </NuxtLink>
      <div class="flex space-x-4 text-[11px] mt-1 text-gray-500">
        <div class="flex items-center space-x-1 cursor-pointer hover:text-primary/50">
          <UIcon name="i-carbon-user" />
          <span>{{author.username}}</span>
        </div>
        <div class="flex items-center space-x-1 ">
          <UIcon name="i-carbon-view" />
          <span>{{viewCount}}</span>
        </div>
        <div class="flex items-center space-x-1 cursor-pointer hover:text-primary/50">
          <UIcon name="i-carbon-book" />
          <span>{{replyCount}}</span>
        </div>
        <div class="flex items-center space-x-1 ">
          <UIcon name="i-carbon-time" />
          <span>{{$dayjs(createdAt).fromNow()}}</span>
        </div>
      </div>
    </div>
    <UBadge color="gray" variant="solid" size="xs" class="cursor-pointer hover:bg-gray-100 self-center">{{props.tag.name}}</UBadge>
  </div>
</template>

<script lang="ts" setup>
import type { QueryPostResponse } from '~/server/api/post/list.post';
type aaaa = QueryPostResponse[number]
const props = defineProps<QueryPostResponse[number]>()
  
</script>

<style scoped></style>