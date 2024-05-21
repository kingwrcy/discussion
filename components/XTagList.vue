<template>
  <div class="flex space-x-2">
    <UBadge :color="selectedTag === tag.name ? 'primary' :'gray'" variant="solid" size="xs" class="cursor-pointer "
      v-for="tag in tagList">
      <NuxtLink :to="`/tag/${tag.name}`">{{ tag.name }}({{ tag.count }})</NuxtLink>
    </UBadge>
  </div>
</template>

<script lang="ts" setup>
import type { TagDTO } from '~/types';
const route = useRoute()

const tagRes = useFetch('/api/tag/list', {
  method: 'POST',
  key: "tagLists"
})

const tagList = computed(() => {
  return tagRes.data.value?.tags as any as TagDTO[]
})

const selectedTag = ref('')

watch(()=>route.fullPath,()=>{
  selectedTag.value = route.params.tag as string
},{immediate:true})
</script>

<style scoped></style>