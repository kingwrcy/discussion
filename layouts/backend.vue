<template>
  <div class="flex flex-row gap-2 container mx-auto">
    <div class="flex flex-col space-y-1 max-w-[150px] text-sm">
      <NuxtLink to="/manage" class="flex items-center space-x-1 p-2 text-lg cursor-pointer hover:text-primary/80">
        <UIcon name="i-carbon-user" class="text-primary/80" />
        <span>用户管理</span>
      </NuxtLink>

      <NuxtLink to="/manage/tag" class="flex items-center space-x-1 p-2 text-lg cursor-pointer hover:text-primary/80">
        <UIcon name="i-carbon-user" class="text-primary/80" />
        <span>标签管理</span>
      </NuxtLink>

      <div class="flex items-center space-x-1 p-2 text-lg cursor-pointer hover:text-primary/80">
        <UIcon name="i-carbon-add-comment" class="text-primary/80" />
        <span>帖子管理</span>
      </div>

      <div class="flex items-center space-x-1 p-2 text-lg cursor-pointer hover:text-primary/80">
        <UIcon name="i-carbon-book" class="text-primary/80" />
        <span>评论管理</span>
      </div>

      <div class="flex items-center space-x-1 p-2 text-lg cursor-pointer hover:text-primary/80">
        <UIcon name="i-carbon-settings" class="text-primary/80" />
        <span>系统设置</span>
      </div>
    </div>
    <slot />
  </div>
</template>

<script lang="ts" setup>

</script>

<style scoped>

</style>