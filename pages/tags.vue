<template>
  <UCard class="flex-1 mt-2 " style="min-height: 300px;">
    <div class="flex flex-wrap gap-2 ">
    <UBadge color="gray" variant="solid" size="md" class="cursor-pointer "
      v-for="tag in tagList">
      <NuxtLink :to="`/go/${tag.enName}`">{{ tag.name }}</NuxtLink>
    </UBadge>
  </div>
  </UCard>
</template>

<script lang="ts" setup>
import type { TagDTO } from '~/types';
const tagRes = await useFetch('/api/go/list', {
  method: 'POST',
  key: "tagLists"
})

const tagList = computed(() => {
  return tagRes.data.value?.tags as any as TagDTO[]
})
</script>

<style scoped>

</style>