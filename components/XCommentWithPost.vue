<template>
  <div class="flex space-x-2  items-start py-2">
    <div class="flex-1 ">
      <div class="flex space-x-4 text-xs mt-1 text-gray-500 bg-primary/10 p-2 rounded">
       

        <div class="flex items-center space-x-1 ">
          <UIcon name="i-carbon-time" />
          <span>{{ dateFormatAgo(createdAt)}}</span>
        </div>

        <div class="">
          回复了<NuxtLink class="font-bold" :to="`/member/${author.uid}`">{{ author.username }}</NuxtLink>创建的主题 > 
          <NuxtLink class="font-bold" :to="`/post/${post?.pid}`">{{ post?.title }}</NuxtLink>
        </div>
        
      </div>
      <div class="text-gray-600  text-sm  hover:text-primary/80">
        <MdPreview :model-value="content" :editor-id="cid" />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { MdPreview } from "md-editor-v3";
import type { CommentDTO } from "~/types";

const props = defineProps<CommentDTO>();


</script>

<style scoped></style>
