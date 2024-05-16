<template>
  <UCard class="w-full mt-2">
    <template #header>
      <XPost v-bind="post" />
      <div class="my-4 text-sm leading-5" v-html="post.content"></div>
    </template>
  </UCard>
</template>

<script lang="ts" setup>
import type { PostDTO } from '~/types';
const route = useRoute()

const { data } = await useFetch('/api/post/' + route.params.pid, {
  method: 'POST'
})

const post = (data.value as {success:boolean,post:PostDTO}).post
</script>

<style scoped></style>