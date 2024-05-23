<template>
  <div>
    <x-header></x-header>
    <div class="flex max-w-[1080px] mx-auto h-full gap-4 ">

      <slot />
      <div class="space-y-4 w-[350px]">
        <XUserCard v-if="userinfo && userinfo.username && !route.fullPath.startsWith('/member')" />

        <UCard class="w-full mt-2">
          <template #header>
            <div class="text-sm">关于本站</div>
          </template>
          <div class="text-xs ">
            <MdPreview :model-value="sysconfig.websiteAnnouncement" editor-id="websiteAnnouncement" />
          </div>
        </UCard>
      </div>
    </div>
    <XFooter />
  </div>
  <Toaster position="top-center" richColors />
</template>
<script lang="ts" setup>
import { MdPreview } from "md-editor-v3";

import { Toaster } from 'vue-sonner';
import type { SysConfigDTO, UserDTO } from '~/types';
let userinfo = useState<UserDTO>('userinfo')
const config = useRuntimeConfig()
const token = useCookie(config.public.tokenKey)
const route = useRoute()

const loadProfile = async () => {
  const userinfoRes = await useFetch('/api/member/profile', {
    method: 'POST'
  })
  if (userinfoRes.data.value) {
    userinfo.value = userinfoRes.data.value as UserDTO
  }
}

const {data:configData} = await useFetch('/api/config', { 
  method: 'POST' ,
  // transform:(res)=>{
  //   return {
  //     ann:res.data?
  //   }
  // }
})
const sysconfig = configData.value?.data as SysConfigDTO


userCardChanged.on(async () => {
  const userinfoRes = await $fetch('/api/member/profile', {
    method: 'POST'
  })
  if (userinfoRes) {
    userinfo.value = userinfoRes as UserDTO
  }
})

watch(token, async () => {
  if (token.value) {
    const userinfoRes = await $fetch('/api/member/profile', {
      method: 'POST'
    })
    if (userinfoRes) {
      userinfo.value = userinfoRes as UserDTO
    }
  }
})

await loadProfile()

useHead({
  title: "首页",
  meta: [
    { name: "keywords", content: "极简论坛" },
    { name: "description", content: "极简论坛" },
  ],
})
</script>
