<script setup lang="ts">
import { UserRole } from '@prisma/client';
import type { UserDTO } from '~/types';


const config = useRuntimeConfig()
const token = useCookie(config.public.tokenKey)
const userinfo = useState<UserDTO | undefined>('userinfo')
const logout = () => {
  token.value = ''
  userinfo.value = undefined
}


</script>

<template>
  <div class="w-full bg-white shadow">
    <div class="max-w-[1080px] mx-auto flex text-sm">

      <NuxtLink class="flex gap-1 items-center p-2 hover:text-primary/80" to="/">
        <UIcon name="i-carbon-home" />
        <span>首页</span>
      </NuxtLink>


      <div class="flex items-center gap-1 ml-auto ">   
        <NuxtLink class="flex gap-1 items-center p-2 hover:text-primary/80" to="/manage" v-if="token && userinfo?.role === UserRole.ADMIN">
          <UIcon name="i-carbon-add-comment" />
          <span>管理</span>
        </NuxtLink>  
        <NuxtLink class="flex gap-1 items-center p-2 hover:text-primary/80" to="/post/new" v-if="token && userinfo?.status === 'NORMAL'">
          <UIcon name="i-carbon-add-comment" />
          <span>发帖</span>
        </NuxtLink>
        <UBadge v-if="token && userinfo?.status === 'BANNED'">被禁言,到{{ $dayjs(userinfo?.bannedEnd).format('YYYY-MM-DD HH:mm:ss') }}</UBadge>
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
