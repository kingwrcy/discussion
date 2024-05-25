<template>
  <NuxtLoadingIndicator />
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<style>
html,
body,
#__nuxt {
  width: 100%;
  height: 100%;
  @apply bg-slate-50;
}
</style>

<script setup lang="ts">
import 'md-editor-v3/lib/style.css';

useHead({
  // as a string,
  // where `%s` is replaced with the title
  titleTemplate: '%s - 极简论坛',
})</script>