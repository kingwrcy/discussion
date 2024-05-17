<template>
  <div class="flex space-x-2">
    <UBadge color="gray" variant="solid" size="xs" class="cursor-pointer hover:bg-gray-100 bg-primary/20"
    v-for="tag in tagList">{{tag.name}}({{ tag.count }})</UBadge>
    
  </div>
</template>

<script lang="ts" setup>
import type { TagDTO } from '~/types';

const tagRes = useFetch('/api/tag/list', {
  method: 'POST',
  key:"tagLists"
})

const tagList = computed(()=>{
  return tagRes.data.value?.tags as any as TagDTO[]
})

</script>

<style scoped>

</style>