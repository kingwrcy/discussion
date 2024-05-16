<template>
  <div class="flex space-x-2 items-start py-2 border-b border-primary/10">
    <UAvatar :src="props.author.avatar" size="md" alt="Avatar" />
    <div class="flex-1">
      <div v-html="props.content"></div>
      <div class="flex space-x-4 text-[11px] mt-1 text-gray-500">
        <div class="flex items-center space-x-1 cursor-pointer hover:text-primary/50">
          <UIcon name="i-carbon-user" />
          <span>{{ props.author.name }}</span>
        </div>
        <div class="flex items-center space-x-1">
          <UIcon name="i-carbon-view" />
          <span>{{ props.like }}</span>
        </div>
        <div class="flex items-center space-x-1 cursor-pointer hover:text-primary/50">
          <UIcon name="i-carbon-book" />
          <span>{{ props.disLike }}</span>
        </div>
        <div class="flex items-center space-x-1">
          <UIcon name="i-carbon-time" />
          <span>{{ $dayjs(props.created).fromNow() }}</span>
        </div>
      </div>
    </div>
    <UBadge color="gray" variant="solid" size="xs" class="cursor-pointer hover:bg-gray-100 self-center">
      {{ props.post.tag.name }}
    </UBadge>
  </div>
</template>

<script lang="ts" setup>
import type { Comment } from "~/types";

const props = defineProps<Comment>();
</script>

<style scoped></style>
