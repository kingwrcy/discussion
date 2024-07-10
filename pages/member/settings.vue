<script lang="ts" setup>
import { toast } from 'vue-sonner'
import type { z } from 'zod'
import { useClipboard } from '@vueuse/core'
import XTipModal from '../../components/XTipModal.vue'
import type { FormSubmitEvent } from '#ui/types'
import type { UserDTO } from '~/types'
import { saveSettingsRequestSchema } from '~/types'

const { data } = await useFetch(`/api/member/profile`, { method: 'POST' })
const userinfo = data.value as UserDTO
const { copy } = useClipboard({})
const config = useRuntimeConfig()
const globalConfig = useGlobalConfig()
const { sysConfig } = globalConfig.value
useHead({
  title: `${userinfo.username}的个人设置`,
})
type Schema = z.output<typeof saveSettingsRequestSchema>

const state = reactive({
  headImg: userinfo.headImg,
  email: userinfo.email,
  password: undefined,
  css: userinfo.css,
  js: userinfo.js,
  signature: userinfo.signature,
})

async function onSubmit(event: FormSubmitEvent<Schema>) {
  await $fetch('/api/member/saveSettings', {
    method: 'POST',
    body: JSON.stringify(event.data),
  })
  if (event.data.password) {
    toast.success('密码修改成功,请重新登录')
    await refreshCookie(config.public.tokenKey)
    await navigateTo('/member/login')
  }
  else {
    toast.success('修改成功')
  }
}
const openInviteCodeList = ref(false)
function toggleInviteCodelist() {
  openInviteCodeList.value = !openInviteCodeList.value
}
const inviteCode = ref<string>('')
const modal = useModal()
async function createInviteCode() {
  modal.open(XTipModal, {
    message: `生成邀请码将会扣除${sysConfig.createInviteCodePoint}积分，是否继续`,
    async onSuccess() {
      const result = await $fetch<{ success: boolean, message: string, data: string }>('/api/member/createInviteCode', {
        method: 'POST',
      })
      inviteCode.value = result.data
      modal.close()
      openInviteCodeList.value = true
    },
    onCancel() {
      modal.close()
    },
  })
}
async function copyCode() {
  copy(inviteCode.value)
  toast.success('复制成功')
}
</script>

<template>
  <UCard class="w-full mt-2 text-sm">
    <template #header>
      <div class="flex gap-1 items-center">
        <UIcon name="i-carbon-settings" title="设置" class="size-4" /><span class="font-semibold">个人设置</span>
      </div>
    </template>
    <UForm :schema="saveSettingsRequestSchema" :state="state" class="space-y-4" @submit="onSubmit">
      <UFormGroup label="用户名">
        {{ userinfo.username }}
      </UFormGroup>
      <UFormGroup label="等级">
        {{ userinfo.level }}级 - (<NuxtLink class="text-blue-500" :to="`/member/${userinfo.username}/point`">
          {{ userinfo.point }}分
        </NuxtLink>)
      </UFormGroup>
      <UFormGroup label="头像">
        <UAvatar :src="getAvatarUrl(userinfo.avatarUrl!, userinfo.headImg)" size="lg" alt="Avatar" />
      </UFormGroup>
      <UFormGroup label="密码" name="password" hint="留空则不修改密码">
        <UInput v-model="state.password" type="password" />
      </UFormGroup>
      <UFormGroup label="自定义头像" name="headImg" hint="请填写头像地址，将会优先于gravatar显示">
        <UInput v-model="state.headImg" type="text" />
      </UFormGroup>
      <UFormGroup label="邮箱" name="email" hint="请使用常用邮箱,会用来生成头像">
        <UInput v-model="state.email" type="text" />
      </UFormGroup>
      <UFormGroup v-if="sysConfig.invite" label="邀请码" name="email" hint="24小时内单次有效">
        <UButtonGroup size="sm" orientation="horizontal">
          <UButton @click="createInviteCode">
            生成邀请码
          </UButton>
          <UInput v-model="inviteCode" disabled />
          <UButton icon="i-heroicons-clipboard-document" color="gray" @click="copyCode" />
          <UButton color="gray" @click="toggleInviteCodelist">
            历史邀请码列表
          </UButton>
        </UButtonGroup>
      </UFormGroup>
      <XInviteCodeList v-if="openInviteCodeList" />

      <UFormGroup label="自定义css" name="css" hint="修改了此项需要刷新页面">
        <UTextarea v-model="state.css" :rows="10" />
      </UFormGroup>
      <UFormGroup label="自定义JS" name="css" hint="修改了此项需要刷新页面">
        <UTextarea v-model="state.js" :rows="10" />
      </UFormGroup>
      <UFormGroup label="自定义签名" name="css">
        <template #hint>
          2级以上用户可以添加,只支持markdown语法的链接写法,不支持其它格式,比如图片等
        </template>
        <UTextarea
          v-model="state.signature" placeholder="[Moments](https://m.mblog.club)"
          :disabled="userinfo.level < 2 && userinfo.role === 'USER'"
        />
      </UFormGroup>
      <UButton type="submit">
        保存
      </UButton>
    </UForm>
  </UCard>
</template>

<style scoped></style>
