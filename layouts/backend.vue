<template>
  <div class="flex flex-row gap-2 container mx-auto">
    <UCard class="flex flex-col space-y-1 max-w-[150px] text-sm">
      <NuxtLink to="/manage" class="flex items-center space-x-1 p-2 cursor-pointer hover:text-primary/80">
        <UIcon name="i-carbon-user" class="text-primary/80" />
        <span>用户管理</span>
      </NuxtLink>

      <NuxtLink to="/manage/tag" class="flex items-center space-x-1 p-2 cursor-pointer hover:text-primary/80">
        <UIcon name="i-carbon-user" class="text-primary/80" />
        <span>标签管理</span>
      </NuxtLink>

      <NuxtLink to="/manage/post" class="flex items-center space-x-1 p-2 cursor-pointer hover:text-primary/80">
        <UIcon name="i-carbon-add-comment" class="text-primary/80" />
        <span>帖子管理</span>
      </NuxtLink>

      <NuxtLink to="/manage/comment" class="flex items-center space-x-1 p-2 cursor-pointer hover:text-primary/80">
        <UIcon name="i-carbon-book" class="text-primary/80" />
        <span>评论管理</span>
      </NuxtLink>

      <div class="flex items-center space-x-1 p-2 cursor-pointer hover:text-primary/80">
        <UIcon name="i-carbon-settings" class="text-primary/80" />
        <span>系统设置</span>
      </div>
      <NuxtLink to="/" class="flex items-center space-x-1 p-2 cursor-pointer hover:text-primary/80">
        <UIcon name="i-carbon-settings" class="text-primary/80" />
        <span>返回首页</span>
      </NuxtLink>
    </UCard>
    <slot />
  </div>
</template>

<script lang="ts" setup>

</script>

<style scoped>

</style>