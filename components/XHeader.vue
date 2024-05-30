<script setup lang="ts">
import { UserRole } from '@prisma/client';
import { useColorMode } from '@vueuse/core';
import type { UserDTO } from '~/types';
const router = useRouter()
const route = useRoute()
const mode = useColorMode()
const config = useRuntimeConfig()
const token = useCookie(config.public.tokenKey)
const userinfo = useState<UserDTO | undefined>('userinfo')
const logout = () => {
  token.value = ''
  userinfo.value = undefined
}


const toggleMode = () => {
  if (mode.value === 'dark') {
    mode.value = 'light'
  } else {
    mode.value = 'dark'
  }
}

const go2Home = async () => {
  await router.replace('/')
  if (route.fullPath === '/') {
    await refreshNuxtData()
  }
}

const sliderOpen = useState('sliderOpen', ()=>{return false})
const showSlider = ()=>{
  sliderOpen.value = !sliderOpen.value
}


</script>

<template>
  <div class="header w-full bg-white dark:bg-slate-600 shadow sticky top-0 z-10 px-2 md:px-0">
    <div class="max-w-[1080px] mx-auto flex text-[15px] py-1 items-center">
      <div @click="showSlider" class="cursor-pointer flex gap-1 items-center p-2 hover:text-primary/80 md:hidden">
          <UIcon name="i-carbon-bare-metal-server" class="size-5" />          
        </div>
      <div @click="go2Home" to="/" class="cursor-pointer hover:text-primary/80">
        <div class="font-semibold text-xl">Discussion</div>
      </div>
      <div class="flex items-center gap-1 ml-auto ">
      
        <UIcon @click="toggleMode" v-if="mode === 'light'" dynamic name="i-line-md-moon-rising-loop"
          class="text-yellow-500 cursor-pointer size-6"></UIcon>
        <UIcon @click="toggleMode" v-else dynamic name="i-line-md-moon-filled-alt-to-sunny-filled-loop-transition"
          class="text-yellow-500 cursor-pointer size-6"></UIcon>
        <div @click="go2Home" class="cursor-pointer hidden md:flex gap-1 items-center p-2 hover:text-primary/80">
          <UIcon name="i-carbon-home" class="size-6 md:size-4"/>
          <span class="hidden md:block">首页</span>
        </div>
        <NuxtLink class="hidden md:flex gap-1 items-center p-2 hover:text-primary/80" to="/manage"
          v-if="token && userinfo?.role === UserRole.ADMIN">
          <UIcon name="i-carbon-datastore" class="size-6 md:size-4"/>
          <span class="hidden md:block">管理</span>
        </NuxtLink>
        <NuxtLink class="flex gap-1 items-center p-2 hover:text-primary/80" to="/post/new"
          v-if="token && userinfo?.status === 'NORMAL' && userinfo.point > 0">
          <UIcon name="i-carbon-add-comment" class="size-6 md:size-4"/>
          <span class="hidden md:block">发帖</span>
        </NuxtLink>
        <UBadge v-if="token && userinfo?.status === 'BANNED'">被禁言,到{{ dateFormat(userinfo?.bannedEnd) }}</UBadge>
        <NuxtLink class="flex gap-1 items-center p-2 hover:text-primary/80" to="/member/login" v-if="!token">
          <UIcon name="i-carbon-login" class="size-6 md:size-4"/>
          <span class="hidden md:block">登录</span>
        </NuxtLink>
        <div class="flex gap-1 items-center p-2 hover:text-primary/80 cursor-pointer" to="/login" v-if="token"
          @click="logout">
          <UIcon name="i-carbon-logout" class="size-6 md:size-4"/>
          <span class="hidden md:block">登出</span>
        </div>
      </div>
    </div>
  </div>

</template>