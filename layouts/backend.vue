<template>
  <div class="flex flex-row gap-2 container mx-auto">
    <UCard class="flex flex-col space-y-1 max-w-[150px] text-sm">
      <NuxtLink to="/manage" :class="{'active':selectedMenu === 'user' }" class="flex items-center space-x-1 p-2 cursor-pointer hover:text-primary/80">
        <UIcon name="i-carbon-user" class="text-primary/80" />
        <span>用户管理</span>
      </NuxtLink>

      <NuxtLink to="/manage/tag" :class="{'active':selectedMenu === 'tag' }" class="flex items-center space-x-1 p-2 cursor-pointer hover:text-primary/80">
        <UIcon name="i-carbon-user" class="text-primary/80" />
        <span>标签管理</span>
      </NuxtLink>

      <NuxtLink to="/manage/post" :class="{'active':selectedMenu === 'post' }" class="flex items-center space-x-1 p-2 cursor-pointer hover:text-primary/80">
        <UIcon name="i-carbon-add-comment" class="text-primary/80" />
        <span>帖子管理</span>
      </NuxtLink>

      <NuxtLink to="/manage/comment" :class="{'active':selectedMenu === 'comment' }" class="flex items-center space-x-1 p-2 cursor-pointer hover:text-primary/80">
        <UIcon name="i-carbon-book" class="text-primary/80" />
        <span>评论管理</span>
      </NuxtLink>

      <NuxtLink to="/manage/settings" :class="{'active':selectedMenu === 'settings' }" class="flex items-center space-x-1 p-2 cursor-pointer hover:text-primary/80">
        <UIcon name="i-carbon-settings" class="text-primary/80" />
        <span>系统设置</span>
      </NuxtLink>
      <NuxtLink to="/" class="flex items-center space-x-1 p-2 cursor-pointer hover:text-primary/80">
        <UIcon name="i-carbon-settings" class="text-primary/80" />
        <span>返回首页</span>
      </NuxtLink>
    </UCard>
    <slot />
    <Toaster position="top-center" richColors />
  </div>  
</template>

<script lang="ts" setup>
import { Toaster } from 'vue-sonner';

useHead({
  title:"管理后台",
  meta:[
    {name:"keywords",content:"极简论坛"},
    {name:"description",content:"极简论坛"},
  ],
})
const selectedMenu = ref('user')
const route = useRoute()

watch(() => route.path, () => {
  const path = route.path
  if (path.startsWith('/manage/tag')) {
    selectedMenu.value = 'tag'
  } else if (path.startsWith('/manage/post')) {
    selectedMenu.value = 'post'
  } else if (path.startsWith('/manage/comment')) {
    selectedMenu.value = 'comment'
  } else if (path.startsWith('/manage/settings')) {
    selectedMenu.value = 'settings'
  } else {
    selectedMenu.value = 'user'
  }
},{immediate: true})

</script>

<style scoped>
.active{
  @apply bg-gray-400 rounded text-white;
}
</style>