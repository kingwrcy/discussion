<script lang="ts" setup>
import type { ToolbarNames } from 'md-editor-v3'
import { MdEditor } from 'md-editor-v3'
import { toast } from 'vue-sonner'
import { useColorMode } from '@vueuse/core'

useHead({
  title: '系统设置',
})
definePageMeta({
  layout: 'backend',
})
const mode = useColorMode()

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
]
const { data: configData } = await useFetch('/api/manage/config/get', { method: 'POST' })

const state = reactive({
  websiteName: '极简论坛',
  websiteUrl: '',
  webBgimage: '',
  websiteKeywords: '极简,论坛,极简论坛',
  websiteDescription: '极简论坛',
  pointPerPost: 5,
  pointPerPostByDay: 20,
  pointPerComment: 1,
  pointPerCommentByDay: 20,
  pointPerLikeOrDislike: 1,
  pointPerDaySignInMin: 1,
  pointPerDaySignInMax: 10,
  websiteAnnouncement: ``,
  css: '',
  js: '',
  postUrlFormat: {
    type: 'UUID',
    minNumber: 10000,
    dateFormat: 'YYYYMMDDHHmmssSSS',
  },
  invite: false,
  createInviteCodePoint: 100,
  regWithEmailCodeVerify: false,
  email: {
    host: '',
    port: 465,
    username: '',
    password: '',
    secure: true,
    to: '',
    senderName: '',
  },
  googleRecaptcha: {
    siteKey: '',
    secretKey: '',
    enable: false,
  },
})

Object.assign(state, configData.value?.config)

async function saveSettings() {
  await $fetch('/api/manage/config/save', {
    method: 'POST',
    body: JSON.stringify(state),
  })
  toast.success('保存成功')
  window.location.reload()
}

const postUrlFormatOptions = [{ value: 'UUID', label: 'UUID' }, { value: 'Number', label: '数字' }, { value: 'Date', label: '日期' }]

const items = [{
  label: '邮件设置',
  icon: 'i-carbon-email',
  defaultOpen: false,
  slot: 'email-settings',
}, {
  label: '外观设置',
  icon: 'i-carbon-machine-learning',
  defaultOpen: false,
  slot: 'appearance-settings',
}, {
  label: 'Google Recaptcha',
  icon: 'i-carbon-security',
  defaultOpen: false,
  slot: 'recaptcha-settings',
}]

const emailSending = ref(false)

async function testEmail() {
  emailSending.value = true
  const { success, message } = await $fetch('/api/manage/testEmail', {
    method: 'POST',
    body: JSON.stringify(state.email),
  })
  if (success) {
    toast.success('发送成功')
  }
  else {
    toast.error(message)
  }
  emailSending.value = false
}
</script>

<template>
  <UCard class="flex-1">
    <div class="flex flex-col space-y-2">
      <div class="flex flex-row space-x-2">
        <UFormGroup label="论坛名称" name="websiteName">
          <UInput v-model="state.websiteName" autocomplete="off" />
        </UFormGroup>
        <UFormGroup label="论坛地址" name="websiteUrl">
          <UInput v-model="state.websiteUrl" autocomplete="off" />
        </UFormGroup>
        <UFormGroup label="论坛背景图" name="webBgimage">
          <UInput v-model="state.webBgimage" autocomplete="off" />
        </UFormGroup>
        <UFormGroup label="论坛关键词" name="websiteKeywords">
          <UInput v-model="state.websiteKeywords" autocomplete="off" />
        </UFormGroup>
        <UFormGroup label="论坛描述" name="websiteDescription">
          <UInput v-model="state.websiteDescription" autocomplete="off" />
        </UFormGroup>
      </div>

      <div class="flex flex-row space-x-2">
        <UFormGroup label="站点公告" name="websiteAnnouncement">
          <ClientOnly>
            <MdEditor
              v-model="state.websiteAnnouncement" style="height:200px;" :theme="mode as any" :preview="false"
              :toolbars="toolbars" editor-id="sysSettings" @on-upload-img="onUploadImg"
            />
          </ClientOnly>
        </UFormGroup>
      </div>

      <div class="flex flex-row space-x-2">
        <UFormGroup label="帖子链接格式定义" name="type">
          <USelectMenu
            v-model="state.postUrlFormat.type" :options="postUrlFormatOptions" value-attribute="value"
            option-attribute="label"
          />
        </UFormGroup>
        <UFormGroup v-if="state.postUrlFormat.type === 'Number'" label="起始数字" name="minNumber">
          <UInput v-model="state.postUrlFormat.minNumber" />
        </UFormGroup>
        <UFormGroup v-if="state.postUrlFormat.type === 'Date'" label="日期格式" name="dateFormat">
          <template #hint>
            <ULink class="text-green-600 underline" to="https://day.js.org/docs/zh-CN/display/format" target="_blank">
              支持的格式
            </ULink>
          </template>
          <UInput v-model="state.postUrlFormat.dateFormat" />
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
      <div class="flex flex-row space-x-2">
        <UFormGroup label="是否启用邀请注册" name="pointPerDaySignInMin">
          <UToggle v-model="state.invite" />
        </UFormGroup>
      </div>

      <div class="flex flex-row space-x-2">
        <UFormGroup label="每次生成邀请码需要积分" name="createInviteCodePoint">
          <UInput v-model.number="state.createInviteCodePoint" autocomplete="off" />
        </UFormGroup>
      </div>
      <div class="flex flex-row space-x-2">
        <UFormGroup label="每次生成邀请码需要积分" name="createInviteCodePoint">
          <UInput v-model.number="state.createInviteCodePoint" autocomplete="off" />
        </UFormGroup>
      </div>

      <UAccordion :items="items" :ui="{ container: 'max-w-[500px]' }">
        <template #email-settings>
          <UFormGroup label="开启邮件验证注册用户" name="regWithEmailCodeVerify">
            <USelectMenu
              v-model="state.regWithEmailCodeVerify" value-attribute="value" option-attribute="label"
              :options="[{ value: true, label: '是' }, { value: false, label: '否' }]"
            />
          </UFormGroup>
          <UFormGroup label="邮件服务器" name="host">
            <UInput v-model="state.email.host" autocomplete="off" />
          </UFormGroup>
          <UFormGroup label="端口" name="port">
            <UInput v-model.number="state.email.port" autocomplete="off" />
          </UFormGroup>
          <UFormGroup label="用户名" name="username">
            <UInput v-model="state.email.username" autocomplete="off" />
          </UFormGroup>
          <UFormGroup label="密码" name="password">
            <UInput v-model="state.email.password" autocomplete="off" />
          </UFormGroup>
          <UFormGroup label="是否安全连接" name="secure">
            <USelectMenu
              v-model="state.email.secure" value-attribute="value" option-attribute="label"
              :options="[{ value: true, label: '是' }, { value: false, label: '否' }]"
            />
          </UFormGroup>
          <UFormGroup label="发件人名称" name="senderName">
            <UInput v-model="state.email.senderName" autocomplete="off" />
          </UFormGroup>
          <UButtonGroup size="sm" orientation="horizontal" class="my-2">
            <UInput v-model="state.email.to" placeholder="测试邮件接收地址" />
            <UButton class="w-fit " size="xs" :loading="emailSending" @click="testEmail">
              测试发送邮件
            </UButton>
          </UButtonGroup>
        </template>

        <template #appearance-settings>
          <div class="flex flex-col space-y-2 ">
            <div class="flex flex-row space-x-2">
              <UFormGroup label="自定义css" name="css" class="w-[500px]">
                <UTextarea v-model="state.css" :rows="10" />
              </UFormGroup>
            </div>

            <div class="flex flex-row space-x-2">
              <UFormGroup label="自定义JS" name="css" class="w-[500px]">
                <UTextarea v-model="state.js" :rows="10" />
              </UFormGroup>
            </div>
          </div>
        </template>

        <template #recaptcha-settings>
          <div class="flex flex-col space-y-2 ">
            <div class="flex flex-row space-x-2">
              <UFormGroup label="是否启用" name="googleRecaptchaEnabled" class="w-[500px]">
                <USelectMenu
                  v-model="state.googleRecaptcha.enable" value-attribute="value" option-attribute="label"
                  :options="[{ value: true, label: '是' }, { value: false, label: '否' }]"
                />
              </UFormGroup>
            </div>

            <div class="flex flex-row space-x-2">
              <UFormGroup label="Site Key" name="css" class="w-[500px]">
                <UInput v-model="state.googleRecaptcha.siteKey" autocomplete="off" />
              </UFormGroup>
              <UFormGroup label="Secret Key" name="css" class="w-[500px]">
                <UInput v-model="state.googleRecaptcha.secretKey" autocomplete="off" />
              </UFormGroup>
            </div>
          </div>
        </template>
      </UAccordion>

      <UButton class="w-fit" @click="saveSettings">
        保存
      </UButton>
    </div>
  </UCard>
</template>

<style scoped></style>
