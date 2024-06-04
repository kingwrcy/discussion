<template>
  <div class="dark:bg-slate-800 min-h-screen">
    <USlideover v-model="sliderOpen" class="md:hidden" :side="'left'">
      <div class="p-4 flex-1 space-y-4 bg-slate-700">
        <UIcon name="i-carbon-close-large" class="size-5 text-white" @click="sliderOpen = false"></UIcon>
        <XUserCard v-if="userinfo && userinfo.username" />
        <UCard class="w-full mt-2" v-if="route.fullPath.startsWith('/go/') && tag" :ui="{ header: { padding: 'px-0 py-0 sm:px-0' } }">
          <template #header>
            <div class="px-4 py-1 rounded-t sm:px-6 text-primary bg-gray-100 dark:bg-slate-500">{{ tag.name }}</div>
          </template>
          <div class="text-sm">
            {{ tag.desc }}
          </div>
        </UCard>
        <UCard class="w-full mt-2" v-if="sysconfig" :ui="{ header: { padding: 'px-0 py-0 sm:px-0' } }">
          <template #header>
            <div class="px-4 py-1 rounded-t sm:px-6 text-primary bg-gray-100 dark:bg-slate-500">关于本站</div>
          </template>
          <div class="text-sm">
            <MdPreview :model-value="sysconfig.websiteAnnouncement" editor-id="websiteAnnouncement" no-mermaid no-katex no-highlight />
          </div>
        </UCard>
      </div>
    </USlideover>

    <x-header :siteName="sysconfig.websiteName"></x-header>
    <div class="main flex max-w-[1080px] mx-auto h-full gap-4">
      <div class="flex-1 w-full">
        <slot />
      </div>
      <div class="right-bar space-y-4 w-[300px] hidden md:block">
        <XUserCard v-if="userinfo && userinfo.username && !route.fullPath.startsWith('/member')" />
        <UCard class="profile w-full mt-2" v-if="route.fullPath.startsWith('/go/') && tag" :ui="{ header: { padding: 'px-0 py-0 sm:px-0' } }">
          <template #header>
            <div class="px-4 py-1 rounded-t sm:px-6 text-primary bg-gray-100 dark:bg-slate-500">{{ tag.name }}</div>
          </template>
          <div class="text-sm">
            {{ tag.desc }}
          </div>
        </UCard>
        <UCard class="ann w-full mt-2" v-if="sysconfig" :ui="{ header: { padding: 'px-0 py-0 sm:px-0' } }">
          <template #header>
            <div class="px-4 py-1 rounded-t sm:px-6 text-primary bg-gray-100 dark:bg-slate-500">关于本站</div>
          </template>
          <div class="text-sm">
            <MdPreview :model-value="sysconfig.websiteAnnouncement" editor-id="websiteAnnouncement" no-mermaid no-katex no-highlight />
          </div>
        </UCard>
      </div>
    </div>
    <XFooter :version="version" />
  </div>
  <Toaster position="top-center" richColors :duration="1000" />
</template>
<script lang="ts" setup>
import { useTitle } from "@vueuse/core";
import { MdPreview } from "md-editor-v3";
import { Toaster } from "vue-sonner";
import type { SysConfigDTO, TagDTO, UserDTO } from "~/types";
let userinfo = useState<UserDTO>("userinfo");
const config = useRuntimeConfig();
const token = useCookie(config.public.tokenKey);
const route = useRoute();
const sliderOpen = useState("sliderOpen", () => {
  return false;
});
const global = useState<{ sysConfig: SysConfigDTO; version: string | undefined }>("globalConfig");

const loadProfile = async () => {
  const userinfoRes = await useFetch("/api/member/profile", {
    method: "POST"
  });
  if (userinfoRes.data.value) {
    userinfo.value = userinfoRes.data.value as UserDTO;
  }
};
const sysconfig = global.value?.sysConfig as SysConfigDTO;
const version = global.value?.version;

userCardChanged.on(async () => {
  const userinfoRes = await $fetch("/api/member/profile", {
    method: "POST"
  });
  if (userinfoRes) {
    userinfo.value = userinfoRes as UserDTO;
    if (userinfo.value.unRead > 0) {
      const title = useTitle();
      title.value = title.value + `(${userinfo.value.unRead})`;
    }
  }
});

watch(token, async () => {
  if (token.value) {
    const userinfoRes = await $fetch("/api/member/profile", {
      method: "POST"
    });
    if (userinfoRes) {
      userinfo.value = userinfoRes as UserDTO;
    }
  }
});

await loadProfile();

if (sysconfig.css) {
  useHead({
    style: [
      {
        innerHTML: sysconfig.css
      }
    ]
  });
}

if (sysconfig.js) {
  useHead({
    script: [
      {
        type: "text/javascript",
        innerHTML: sysconfig.js
      }
    ]
  });
}

if (userinfo.value.css) {
  useHead({
    style: [
      {
        innerHTML: userinfo.value.css
      }
    ]
  });
}

if (userinfo.value.js) {
  useHead({
    script: [
      {
        type: "text/javascript",
        innerHTML: userinfo.value.js
      }
    ]
  });
}

useHead({
  title: "首页"
});

const tag = ref<TagDTO>();

watch(
  () => route.fullPath,
  async () => {
    if (route.fullPath.startsWith("/go/")) {
      const name = route.fullPath.replaceAll("/go/", "");
      const res = await $fetch<{ tags: Array<TagDTO> }>("/api/go/list?name=" + name, {
        method: "POST"
      });
      tag.value = res.tags[0] as TagDTO;
    }
  },
  { immediate: true }
);
</script>
