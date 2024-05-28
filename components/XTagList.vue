<template>
  <div class="flex text-sm">
    <div class="flex space-x-2 flex-1 overflow-auto">
      <UBadge :color="selectedTag === tag.name ? 'primary' : 'gray'" variant="solid" size="md" class="shrink-0 cursor-pointer "
        v-for="tag in tagList">
        <NuxtLink :to="`/go/${tag.enName}`">{{ tag.name }}</NuxtLink>
      </UBadge>
      <div v-if="tagList.length === 0" class="text-sm">暂无标签,请去后台添加</div>
    </div>
    <UBadge :color="selectedTag === 'all' ? 'primary' : 'gray'" variant="solid" size="md" class="cursor-pointer w-[78px]" >
      <NuxtLink to="/tags">全部节点</NuxtLink>
    </UBadge>
  </div>
</template>

<script lang="ts" setup>
import type { TagDTO } from '~/types';
const route = useRoute()

const tagRes = await useFetch('/api/go/list?hot=true', {
  method: 'POST',
  key: "tagLists"
})

const tagList = computed(() => {
  return tagRes.data.value?.tags as any as TagDTO[]
})

const selectedTag = ref('')

watch(() => route.fullPath, () => {
  selectedTag.value = route.params.tag as string
}, { immediate: true })
</script>

<style scoped></style>