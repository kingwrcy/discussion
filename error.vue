<script setup lang="ts">
import type { NuxtError } from '#app'

defineProps({
  error: Object as () => NuxtError,
})
</script>

<template>
  <NuxtLayout name="default">
    <UCard class="mt-2">
      <div class="flex flex-col items-center space-y-4">
        <img src="/images/error-404.png" class="w-1/2">
        <div class="text-2xl">
          {{ error?.message }}
        </div>
      </div>
    </UCard>
  </NuxtLayout>
</template>
