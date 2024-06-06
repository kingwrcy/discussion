<script lang="ts" setup>
import { toast } from 'vue-sonner'
import type { z } from 'zod'
import type { FormSubmitEvent } from '#ui/types'
import type { UserDTO } from '~/types'
import { saveSettingsRequestSchema } from '~/types'

const { data } = await useFetch(`/api/member/profile`, { method: 'POST' })
const userinfo = data.value as UserDTO
const config = useRuntimeConfig()
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
      <UFormGroup label="自定义css" name="css" hint="修改了此项需要刷新页面">
        <UTextarea v-model="state.css" />
      </UFormGroup>
      <UFormGroup label="自定义JS" name="css" hint="修改了此项需要刷新页面">
        <UTextarea v-model="state.js" />
      </UFormGroup>
      <UFormGroup label="自定义签名" name="css">
        <template #hint>
          2级以上用户可以添加,只支持markdown语法的链接写法,不支持其它格式,比如图片等
        </template>
        <UTextarea v-model="state.signature" placeholder="[Moments](https://m.mblog.club)" :disabled="userinfo.level < 2" />
      </UFormGroup>
      <UButton type="submit">
        保存
      </UButton>
    </UForm>
  </UCard>
</template>

<style scoped></style>
