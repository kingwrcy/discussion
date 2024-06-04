<script setup lang="ts">
import 'md-editor-v3/lib/style.css'
import type { SysConfigDTO } from './types'

const global = useState<{ sysConfig: SysConfigDTO, version: string | undefined }>('globalConfig')
const { data: configData } = await useFetch('/api/config', {
  method: 'POST',
})
const sysConfig = configData.value?.data as SysConfigDTO
const version = configData.value?.version

global.value = { sysConfig, version }

useHead({
  // as a string,
  // where `%s` is replaced with the title
  titleTemplate: `%s - ${global.value.sysConfig.websiteName}`,
})
</script>

<template>
  <NuxtLoadingIndicator />
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<style>
html,
body,
#__nuxt {
  width: 100%;
  height: 100%;
  @apply bg-slate-50;
}
</style>
