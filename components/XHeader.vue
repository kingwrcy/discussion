<script setup lang="ts">
const config = useRuntimeConfig()
const token = useCookie(config.public.tokenKey)
const logout =()=>{
  token.value = ''
}

</script>

<template>
  <div class="w-full bg-white shadow">
    <div class="max-w-[1080px] mx-auto flex text-sm">

      <NuxtLink class="flex gap-1 items-center p-2 hover:text-primary/80" to="/">
        <UIcon name="i-carbon-home" />
        <span>首页</span>
      </NuxtLink>


      <div class="flex gap-1 ml-auto ">
        <NuxtLink class="flex gap-1 items-center p-2 hover:text-primary/80" to="/post/new" v-if="token">
          <UIcon name="i-carbon-chat" />
          <span>发帖</span>
        </NuxtLink>
        <NuxtLink class="flex gap-1 items-center p-2 hover:text-primary/80" to="/user/login" v-if="!token">
          <UIcon name="i-carbon-login" />
          <span>登录</span>
        </NuxtLink>
        <div class="flex gap-1 items-center p-2 hover:text-primary/80 cursor-pointer" to="/login" v-if="token" @click="logout">
          <UIcon name="i-carbon-logout" />
          <span>登出</span>
        </div>
      </div>
    </div>
  </div>

</template>
