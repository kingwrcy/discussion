<template>

  <div>
    <x-header></x-header>
    <div class="flex max-w-[1080px] mx-auto h-full gap-4 ">
      <div class="flex-1 ">
        <slot />
      </div>
      <div class="space-y-4 w-[300px]">
        <XUserCard v-if="userinfo && userinfo.username && !route.fullPath.startsWith('/member')" />
        <UCard class="w-full mt-2" v-if="route.fullPath.startsWith('/tag/') && tag"
          :ui="{ header: { padding: 'px-0 py-0 sm:px-0' } }">
          <template #header>
            <div class="px-4 py-1 rounded-t sm:px-6 text-primary bg-gray-100">{{ tag.name }}</div>
          </template>
          <div class="text-sm">
            {{ tag.desc }}
          </div>
        </UCard>
        <UCard class="w-full mt-2" v-if="sysconfig" :ui="{ header: { padding: 'px-0 py-0 sm:px-0' } }">
          <template #header>
            <div class="px-4 py-1 rounded-t sm:px-6 text-primary bg-gray-100">关于本站</div>
          </template>
          <div class="text-sm">
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
import type { SysConfigDTO, TagDTO, UserDTO } from '~/types';
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

const { data: configData } = await useFetch('/api/config', {
  method: 'POST',
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

const tag = ref<TagDTO>()

watch(() => route.fullPath, async () => {
  if (route.fullPath.startsWith('/tag/')) {
    const name = route.fullPath.replaceAll('/tag/', '')
    const res = await $fetch<{ tags: Array<TagDTO> }>('/api/tag/list?name=' + name, {
      method: 'POST',
    })
    tag.value = res.tags[0] as TagDTO
  }
}, { immediate: true })
</script>
