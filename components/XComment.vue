<template>
  <div class="px-4 flex space-x-2  items-start py-2 ">
    <UAvatar v-if="author && author.avatarUrl" :src="getAvatarUrl(author.avatarUrl)" size="md" alt="Avatar" />
    <div class="flex-1 ">      
      <div class="flex space-x-4 text-xs mt-1 text-gray-500">
        <div class="flex  items-center space-x-1 cursor-pointer hover:text-primary/50">
          <UIcon name="i-carbon-user" />
          <span>{{ author.username }}</span>
        </div>
        
        <div class="flex items-center space-x-1 ">
          <UIcon name="i-carbon-time" />
          <span>{{ $dayjs(createdAt).fromNow() }}</span>
        </div>
      </div>

      <div
        class="text-gray-600  text-sm  hover:text-primary/80">
       <MdPreview :model-value="content" :editor-id="cid"/>
      </div>
    </div>

    <div class="text-xs text-gray-600 select-none cursor-pointer">{{ `#${index+1}` }}</div>
  </div>
</template>

<script lang="ts" setup>
import { MdPreview } from "md-editor-v3";
import type { CommentDTO } from "~/types";

const props = defineProps<CommentDTO&{index:number}>();

</script>

<style scoped></style>
