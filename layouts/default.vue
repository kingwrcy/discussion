<template>
  <div>
    <x-header></x-header>
    <div class="flex max-w-[1080px] mx-auto h-full gap-4 ">
      
        <slot />
      <div class="space-y-4 w-1/3">
        <UCard class="w-full mt-2">
          <div class="h-20">1</div>
        </UCard>

        <UCard class="w-full mt-2">
          <div class="h-20">2</div>
        </UCard>

        <UCard class="w-full mt-2">
          <div class="h-20">3</div>
        </UCard>
      </div>
    </div>
    <XFooter/>
  </div>
  <Toaster position="top-center" richColors 
  />
</template>
<script lang="ts" setup>

import { Toaster } from 'vue-sonner'

useHead({
  link: [
    // {
    //   rel: 'shortcut icon',
    //   type: 'image/png',
    //   href: userinfo.value?.favicon || '/favicon.png',
    // },
  ],
  style: [
    {
      
    }
  ],
  script: [
    // {
    //   type: 'text/javascript',
    //   innerHTML: userinfo.value?.js || '',
    // }
  ]
})
</script>
