<template>
  <UCard class="w-full mt-2">
    <template #header class="py-1">
      <XTagList />
    </template>
    <div class="flex flex-col my-2">
      <XPost v-for="post in (data as any as ApiResponse).posts" :key="post.id" v-bind="post" />
    </div>
    <UPagination v-model="state.page" :page-count="5" :total="data?.total ?? 0" />

  </UCard>
</template>

<script lang="ts" setup>
import type { QueryPostResponse } from '~/server/api/post/list.post';
import type { InternalApi } from 'nitropack'

type ApiResponse = InternalApi['/api/post/list']['post']
const state = reactive({
  page: 1,
  size: 10
})

const data = await useFetch('/api/post/list', {
  method: 'POST',
  body: JSON.stringify(state)
})


</script>

<style></style>