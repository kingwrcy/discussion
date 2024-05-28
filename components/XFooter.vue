<template>
  <div class="max-w-[1080px] mx-auto flex gap-2 text-xs my-4 px-2 md:px-0 pb-4 text-gray-400" :class="[smAndLarger?'':'justify-between']">
    <span class="">
      @2024 
    </span>
    <span>版本v{{ version }}</span>
    <span class="mx-1">•</span>
    <a target="_blank" href="https://moments.mblog.club">极简朋友圈</a>
    <span class="mx-1">•</span>
    <a target="_blank" href="https://dev.mblog.club">极简博客</a>
    <span class="mx-1">•</span>
    <a target="_blank" href="https://discussion.mblog.club">极简论坛</a>
  </div>
</template>

<script lang="ts" setup>
import { breakpointsTailwind, useBreakpoints } from '@vueuse/core'
const breakpoints = useBreakpoints(breakpointsTailwind)
const smAndLarger = breakpoints.greaterOrEqual('sm')
withDefaults(defineProps<{
  version: string
}>(), {
  version: '1.0'
})

</script>

<style></style>