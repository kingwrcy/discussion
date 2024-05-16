<template>
  <UCard class="w-full mt-2">
    <template #header>
      <XPost v-bind="post" />
      <div class="my-4 text-sm leading-5" >
        <MdPreview  v-model="post.content" />

      </div>
    </template>
  </UCard>
</template>

<script lang="ts" setup>
import type { PostDTO } from '~/types';
import { MdPreview  } from 'md-editor-v3';
import 'md-editor-v3/lib/style.css';
const route = useRoute()

const { data } = await useFetch('/api/post/' + route.params.pid, {
  method: 'POST'
})

const post = (data.value as {success:boolean,post:PostDTO}).post
</script>

<style scoped></style>