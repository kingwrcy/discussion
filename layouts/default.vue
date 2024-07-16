<script lang="ts" setup>
import { useTitle } from '@vueuse/core'
import { MdPreview } from 'md-editor-v3'
import { Toaster } from 'vue-sonner'
import type { SysConfigDTO, TagDTO, UserDTO } from '~/types'

const userinfo = useState<UserDTO>('userinfo')
const keyWords = ref('')
const config = useRuntimeConfig()
const token = useCookie(config.public.tokenKey)
const route = useRoute()
const router = useRouter()
const sliderOpen = useState('sliderOpen', () => {
  return false
})

const global = useGlobalConfig()

async function loadProfile() {
  const userinfoRes = await useFetch('/api/member/profile', {
    method: 'POST',
  })
  if (userinfoRes.data.value) {
    userinfo.value = userinfoRes.data.value as UserDTO
  }
}
const sysconfig = global.value?.sysConfig as SysConfigDTO
const version = global.value?.version

userCardChanged.on(async () => {
  const userinfoRes = await $fetch('/api/member/profile', {
    method: 'POST',
  })
  if (userinfoRes) {
    userinfo.value = userinfoRes as UserDTO
    if (userinfo.value.unRead > 0) {
      const title = useTitle()
      title.value = `${title.value}(${userinfo.value.unRead})`
    }
  }
})

watch(token, async () => {
  if (token.value) {
    const userinfoRes = await $fetch('/api/member/profile', {
      method: 'POST',
    })
    if (userinfoRes) {
      userinfo.value = userinfoRes as UserDTO
    }
  }
})

await loadProfile()

if (sysconfig.css) {
  useHead({
    style: [
      {
        innerHTML: sysconfig.css,
      },
    ],
  })
}

if (sysconfig.js) {
  useHead({
    script: [
      {
        type: 'text/javascript',
        innerHTML: sysconfig.js,
      },
    ],
  })
}

if (sysconfig.favicon) {
  useHead({
    link: [
      {
        rel: 'shortcut icon',
        href: sysconfig.favicon,
      },
    ],
  })
}

if (userinfo.value.css) {
  useHead({
    style: [
      {
        innerHTML: userinfo.value.css,
      },
    ],
  })
}

if (userinfo.value.js) {
  useHead({
    script: [
      {
        type: 'text/javascript',
        innerHTML: userinfo.value.js,
      },
    ],
  })
}

if (sysconfig.googleRecaptcha && sysconfig.googleRecaptcha.enable) {
  useHead({
    script: [
      {
        type: 'text/javascript',
        src: `https://recaptcha.net/recaptcha/api.js?render=${sysconfig.googleRecaptcha.siteKey}`,
      },
    ],
  })
}
const open = ref(false)
function search() {
  if (!keyWords.value)
    return
  router.push({ path: '/', query: { key: keyWords.value.trim() } })
  keyWords.value = ''
  open.value = false
}

useHead({
  title: '首页',
})

const tag = ref<TagDTO>()
watch(() => route.fullPath, async (n) => {
  if (n.startsWith('/post/') || n === '/') {
    userCardChanged.emit()
  }
})
watch(() => route.fullPath, async () => {
  if (route.fullPath.startsWith('/go/')) {
    const name = route.fullPath.replaceAll('/go/', '')
    const res = await $fetch<{ tags: Array<TagDTO> }>(`/api/go/list?name=${name}`, {
      method: 'POST',
    })
    tag.value = res.tags[0] as TagDTO
  }
}, { immediate: true })

const color = useColorMode()
const theme = ref<'light' | 'dark'>(color.value === 'dark' ? 'dark' : 'light')
themeChanged.on((val) => {
  theme.value = val === 'dark' ? 'dark' : 'light'
})

function inputKey(value: any) {
  if (value.target?.value.length > 1) {
    open.value = true
  }
  else {
    open.value = false
  }
}
function GoogleSearch() {
  const webUrl = sysconfig.websiteUrl || window.location.hostname
  const url = `https://www.google.com/search?q=site:${webUrl}%20${encodeURIComponent(keyWords.value)}`
  window.open(url, '_blank')
}
</script>

<template>
  <div class="dark:bg-slate-800 min-h-screen">
    <USlideover v-model="sliderOpen" class="md:hidden overflow-y-auto" side="left">
      <div class="p-4 flex-1 space-y-4 bg-slate-700">
        <UIcon name="i-carbon-close-large" class="size-5 text-white" @click="sliderOpen = false" />
        <UCard class="w-full mt-2" :ui="{ header: { padding: 'px-0 py-0 sm:px-0' } }">
          <UInput
            v-model="keyWords" icon="i-heroicons-magnifying-glass-20-solid" size="sm" color="white"
            :trailing="false" placeholder="Search..." @keydown.enter="search"
          />
        </UCard>
        <XUserCard v-if="userinfo && userinfo.username" />

        <UCard
          v-if="sysconfig && sysconfig.websiteAnnouncement" class="w-full mt-2"
          :ui="{ header: { padding: 'px-0 py-0 sm:px-0' } }"
        >
          <template #header>
            <div class="px-4 py-1 rounded-t sm:px-6 text-primary bg-gray-100 dark:bg-slate-500">
              关于本站
            </div>
          </template>
          <div class="text-sm">
            <MdPreview
              :model-value="sysconfig.websiteAnnouncement" editor-id="websiteAnnouncement" no-mermaid no-katex
              no-highlight
            />
          </div>
        </UCard>
        <UCard
          v-if="route.fullPath.startsWith('/go/') && tag" class="w-full mt-2"
          :ui="{ header: { padding: 'px-0 py-0 sm:px-0' } }"
        >
          <template #header>
            <div class="px-4 py-1 rounded-t sm:px-6 text-primary bg-gray-100 dark:bg-slate-500">
              {{ tag.name }}
            </div>
          </template>
          <div class="text-sm">
            {{ tag.desc }}
          </div>
        </UCard>
        <XHotUser />
      </div>
    </USlideover>

    <x-header :site-name="sysconfig?.websiteName" />
    <div
      v-if="sysconfig.webBgimage" :style="{ backgroundImage: `url(${sysconfig.webBgimage})` }"
      class="hidden md:block fixed w-screen h-screen bg-cover bg-no-repeat bg-[100%] z-0"
    />
    <div class="main flex max-w-[1080px] mx-auto h-full gap-4 relative">
      <div class="flex-1 w-full">
        <slot />
      </div>
      <div class="right-bar space-y-4 w-[300px] hidden md:block">
        <UCard class="w-full mt-2 card" :ui="{ header: { padding: 'px-0 py-0 sm:px-0' } }">
          <UInput
            v-model="keyWords" icon="i-heroicons-magnifying-glass-20-solid" size="sm" color="white" :trailing="false"
            placeholder="Search..." @input="inputKey" @keydown.enter="search"
          />
          <UPopover v-model:open="open" :popper="{ offsetDistance: -10 }">
            <div />
            <template #panel>
              <div class="w-[250px] cursor-pointer">
                <div class="px-4 py-2" @click="search">
                  搜索帖子：{{ keyWords }}
                </div>
                <UDivider />
                <div class="px-4 py-2" @click="GoogleSearch">
                  谷歌搜索：{{ keyWords }}
                </div>
              </div>
            </template>
          </UPopover>
        </UCard>
        <XUserCard v-if="userinfo && userinfo.username" />
        <UCard
          v-if="route.fullPath.startsWith('/go/') && tag" class="profile w-full mt-2"
          :ui="{ header: { padding: 'px-0 py-0 sm:px-0' } }"
        >
          <template #header>
            <div class="px-4 py-1 rounded-t sm:px-6 text-primary bg-gray-100 dark:bg-slate-500">
              {{ tag.name }}
            </div>
          </template>
          <div class="text-sm">
            {{ tag.desc }}
          </div>
        </UCard>
        <UCard
          v-if="sysconfig && sysconfig.websiteAnnouncement" class="ann w-full mt-2"
          :ui="{ header: { padding: 'px-0 py-0 sm:px-0' } }"
        >
          <template #header>
            <div class="px-4 py-1 rounded-t sm:px-6 text-primary bg-gray-100 dark:bg-slate-500">
              关于本站
            </div>
          </template>
          <div class="text-sm">
            <MdPreview
              :model-value="sysconfig.websiteAnnouncement" editor-id="websiteAnnouncement" no-mermaid no-katex
              no-highlight
            />
          </div>
        </UCard>
        <XHotUser />
      </div>
    </div>
    <XFooter :version="version" />
  </div>
  <Toaster position="top-center" rich-colors :duration="1000" />
</template>

<style scoped>
   .card div.relative:nth-of-type(2){
    height: 0px;
   }
</style>
