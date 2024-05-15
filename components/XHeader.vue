<script setup lang="ts">

const links = [[{
  label: '首页',
  icon: 'i-heroicons-home',
  to: '/'
}], [{
  label: '登录',
  icon: 'i-heroicons-home',
  to: '/user/login'
}, {
  label: '登出',
  icon: 'i-heroicons-command-line',
  to: '/user/reg'
}]]
</script>

<template>
  <div class="w-full bg-white shadow">
    <div class="max-w-[1080px] mx-auto ">
      <UHorizontalNavigation :links="links" class="border-b border-gray-200 dark:border-gray-800">
        <template #default="{ link }">
          <span class="group-hover:text-primary relative">{{ link.label }}</span>
        </template>
      </UHorizontalNavigation>
    </div>
  </div>

</template>
