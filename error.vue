<script setup lang="ts">
import type { NuxtError } from '#app'
import type { UserDTO } from '~/types';
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
const props = defineProps({
  error: Object as () => NuxtError
})
</script>

<template>
  <div>
    <x-header></x-header>
    <div class="flex max-w-[1080px] mx-auto h-full gap-4 ">

      <UCard class="w-full mt-2">
        <div class="flex flex-col text-sm items-center justify-center space-y-4">
          <div>{{ error?.message }}</div>
          <div>
            <NuxtLink to="/" class="text-blue-500">返回首页</NuxtLink>
          </div>
        </div>
      </UCard>
      <div class="space-y-4 w-1/3">
        <XUserCard v-if="userinfo && userinfo.username && !route.fullPath.startsWith('/member')" />

        <UCard class="w-full mt-2">
          <template #header>
            <div class="text-sm">关于本站</div>
          </template>
          <div class="text-xs ">
            本站是一个基于Vue3 + Vite2 + VitePress + VitePressTheme的前端项目，后端是基于NestJS + TypeORM + MySQL的后端项目，项目地址：
          </div>
        </UCard>


      </div>
    </div>
    <XFooter />
  </div>
</template>
