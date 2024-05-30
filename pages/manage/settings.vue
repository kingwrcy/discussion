<template>
  <UCard class="flex-1">
    <div class="flex flex-col space-y-2">
      <div class="flex flex-row space-x-2">
        <UFormGroup label="论坛名称" name="websiteName">
          <UInput v-model="state.websiteName" autocomplete="off" />
        </UFormGroup>
      </div>

      <div class="flex flex-row space-x-2">
        <UFormGroup label="站点公告" name="websiteAnnouncement">
          <MdEditor style="height:200px;" :no-upload-img="true" v-model="state.websiteAnnouncement" :preview="false"
            :toolbars="toolbars" editor-id="sysSettings" />
        </UFormGroup>
      </div>

      <div class="flex flex-row space-x-2">
        <UFormGroup label="每次发帖获得积分" name="pointPerPost">
          <UInput v-model.number="state.pointPerPost" autocomplete="off" />
        </UFormGroup>
        <UFormGroup label="每天发帖获得积分上限" name="pointPerPostByDay">
          <UInput v-model.number="state.pointPerPostByDay" autocomplete="off" />
        </UFormGroup>
      </div>

      <div class="flex flex-row space-x-2">
        <UFormGroup label="每次回复获得积分" name="pointPerComment">
          <UInput v-model.number="state.pointPerComment" autocomplete="off" />
        </UFormGroup>
        <UFormGroup label="每天回复获得积分上限" name="pointPerCommentByDay">
          <UInput v-model.number="state.pointPerCommentByDay" autocomplete="off" />
        </UFormGroup>
      </div>

      <div class="flex flex-row space-x-2">
        <UFormGroup label="每次点赞/点踩扣减积分" name="pointPerLikeOrDislike">
          <UInput v-model.number="state.pointPerLikeOrDislike" autocomplete="off" />
        </UFormGroup>

      </div>
      <div class="flex flex-row space-x-2">
        <UFormGroup label="每天签到送积分(最小)" name="pointPerDaySignInMin">
          <UInput v-model.number="state.pointPerDaySignInMin" autocomplete="off" />
        </UFormGroup>
        <UFormGroup label="每天签到送积分(最大)" name="pointPerDaySignInMax">
          <UInput v-model.number="state.pointPerDaySignInMax" autocomplete="off" />
        </UFormGroup>
      </div>

      <div class="flex flex-col space-y-2 ">
        <div class="flex flex-row space-x-2">
          <UFormGroup label="自定义css" name="css" class="w-[500px]" hint="修改了此项需要刷新页面">
            <UTextarea v-model="state.css" />
          </UFormGroup>
        </div>

        <div class="flex flex-row space-x-2">
          <UFormGroup label="自定义JS" name="css" class="w-[500px]" hint="修改了此项需要刷新页面">
            <UTextarea v-model="state.js" />
          </UFormGroup>
        </div>
      </div>

      <UButton @click="saveSettings" class="w-fit">保存</UButton>

    </div>
  </UCard>
</template>

<script lang="ts" setup>
import type { ToolbarNames } from 'md-editor-v3';
import { MdEditor } from 'md-editor-v3';
import { toast } from 'vue-sonner';
useHead({
  title: "系统设置"
})
const route = useRoute()
definePageMeta({
  layout: 'backend'
})

const toolbars: ToolbarNames[] = [
  'bold',
  'underline',
  '-',
  'strikeThrough',
  'quote',
  'unorderedList',
  'orderedList',
  '-',
  'codeRow',
  'code',
  'link',
  'image',
  'table',
  '-',
  'revoke',
  'next',
  '=',
  'preview',
];

const state = reactive({
  websiteName: '极简论坛',
  pointPerPost: 5,
  pointPerPostByDay: 20,
  pointPerComment: 1,
  pointPerCommentByDay: 20,
  pointPerLikeOrDislike: 1,
  pointPerDaySignInMin: 1,
  pointPerDaySignInMax: 10,
  websiteAnnouncement: ``,
  css: '',
  js: "",
})


const { data: configData, refresh } = await useFetch('/api/manage/config/get', { method: 'POST' })

Object.assign(state, configData.value?.config)

const saveSettings = async () => {
  await $fetch('/api/manage/config/save', {
    method: 'POST',
    body: JSON.stringify(state)
  })
  await refresh()
  toast.success('保存成功')
}
</script>

<style scoped></style>