<template>
  <div class="hidden toolbar fixed md:flex flex-col space-y-2 " style="bottom:20%;right:calc(50% - 290px);z-index: 999;">
    <div class="group bg-white rounded px-2 py-1 cursor-pointer" @click="y = 0"
      :class="[y > 0 ? 'visible' : 'invisible']">
      <UIcon name="i-carbon-arrow-up" class="size-6 text-primary/80  group-hover:text-primary/30" title="到顶部"/>
    </div>
    <div class="group bg-white rounded px-2 py-1 cursor-pointer" @click="navigateTo('/')" title="返回首页" v-if="route.fullPath !== '/'">
      <UIcon name="i-carbon-reply" class="size-6 text-primary/80 group-hover:text-primary/30" />
    </div>
    <div class="group bg-white rounded px-2 py-1 cursor-pointer" @click="y = 999999999999"
      :class="[showToBottom ? 'visible' : 'invisible']">
      <UIcon name="i-carbon-arrow-down" class="size-6 text-primary/80 group-hover:text-primary/30" title="到底部"/>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useWindowScroll } from '@vueuse/core'

const { y } = useWindowScroll({ behavior: 'smooth' })
const route = useRoute()

const showToBottom = ref(false)

watch(y, () => {
  const scrollHeight = document.documentElement.scrollHeight;
  const clientHeight = document.documentElement.clientHeight;
  showToBottom.value = scrollHeight - clientHeight - y.value > 100
})
</script>

<style scoped></style>