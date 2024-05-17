<template>
  <UCard class="w-full mt-2">
    <template #header class="py-1">
      <XTagList />
    </template>
    <div class="flex flex-col my-2">
      <XPost v-for="post in postList" :key="post.pid" v-bind="post" />
    </div>
    <UPagination v-model="state.page" :page-count="state.size" :total="totalPosts" v-if="totalPosts > state.size" />

  </UCard>
</template>

<script lang="ts" setup>
import type { PostDTO } from '~/types';

const state = reactive({
  page: 1,
  size: 20
})

const { data } = await useFetch('/api/post/list', {
  method: 'POST',
  body: JSON.stringify(state),
})

const postList = computed(() => {
  return data.value?.posts as any as PostDTO[]
})

const totalPosts = computed(() => {
  return data.value?.total || 0
})

</script>

<style></style>