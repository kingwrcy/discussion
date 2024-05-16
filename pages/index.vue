<template>
  <UCard class="w-full mt-2">
    <template #header class="py-1">
      <XTagList />
    </template>
    <div class="flex flex-col my-2">
      <XPost v-for="post in postList" :key="post.pid" v-bind="post" />
    </div>
    <UPagination v-model="state.page" :page-count="5" :total="data?.total ?? 0" />

  </UCard>
</template>

<script lang="ts" setup>
import type { PostDTO } from '~/types';

const state = reactive({
  page: 1,
  size: 10
})

const {data} = await useFetch('/api/post/list', {
  method: 'POST',
  body: JSON.stringify(state),
})

const postList = data.value?.posts as any as PostDTO[]


</script>

<style></style>