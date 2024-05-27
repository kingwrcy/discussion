<script setup lang="ts">
import { UserRole } from '@prisma/client';
import type { UserDTO } from '~/types';
import { useColorMode } from '@vueuse/core'
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
  router.replace('/')
  if(route.fullPath === '/'){
    await refreshNuxtData()
  }
}


</script>

<template>
  <div class="w-full bg-white dark:bg-slate-600 shadow sticky top-0 z-10 px-2 md:px-0">
    <div class="max-w-[1080px] mx-auto flex text-[15px] py-1 items-center">
      <div @click="go2Home" to="/" class="cursor-pointer hover:text-primary/80">
        <div class="font-semibold text-xl">Discussion</div>
      </div>
      <div class="flex items-center gap-1 ml-auto ">
        <UIcon @click="toggleMode" v-if="mode === 'light'" dynamic name="i-line-md-moon-rising-loop"
          class="text-yellow-500 cursor-pointer"></UIcon>
        <UIcon @click="toggleMode" v-else dynamic name="i-line-md-moon-filled-alt-to-sunny-filled-loop-transition"
          class="text-yellow-500 cursor-pointer"></UIcon>
        <div @click="go2Home" class="cursor-pointer flex gap-1 items-center p-2 hover:text-primary/80" >
          <UIcon name="i-carbon-home" />
          <span>首页</span>
        </div>
        <NuxtLink class="flex gap-1 items-center p-2 hover:text-primary/80" to="/manage"
          v-if="token && userinfo?.role === UserRole.ADMIN">
          <UIcon name="i-carbon-add-comment" />
          <span>管理</span>
        </NuxtLink>
        <NuxtLink class="flex gap-1 items-center p-2 hover:text-primary/80" to="/post/new"
          v-if="token && userinfo?.status === 'NORMAL' && userinfo.point > 0">
          <UIcon name="i-carbon-add-comment" />
          <span>发帖</span>
        </NuxtLink>
        <UBadge v-if="token && userinfo?.status === 'BANNED'">被禁言,到{{ dateFormat(userinfo?.bannedEnd) }}</UBadge>
        <NuxtLink class="flex gap-1 items-center p-2 hover:text-primary/80" to="/member/login" v-if="!token">
          <UIcon name="i-carbon-login" />
          <span>登录</span>
        </NuxtLink>
        <div class="flex gap-1 items-center p-2 hover:text-primary/80 cursor-pointer" to="/login" v-if="token"
          @click="logout">
          <UIcon name="i-carbon-logout" />
          <span>登出</span>
        </div>
      </div>
    </div>
  </div>

</template>