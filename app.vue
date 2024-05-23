<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<style>
html,body,#__nuxt{
  width:100%;
  height:100%;
  @apply bg-slate-100;
}
</style>

<script setup lang="ts">
useHead({
  // as a string,
  // where `%s` is replaced with the title
  titleTemplate: '%s - 极简论坛',
})</script>