<template>
  <UCard class="w-full mt-2 text-sm">
    <template #header>
      <div class="flex gap-1 items-center">
        <UIcon name="i-carbon-settings" title="设置" class="size-4" /><span>个人设置</span>
      </div>
    </template>
    <UForm :schema="saveSettingsRequestSchema" :state="state" class="space-y-4 max-w-[400px]" @submit="onSubmit">
      <UFormGroup label="用户名">
        {{ userinfo.username }}
      </UFormGroup>
      <UFormGroup label="头像">
        <UAvatar :src="getAvatarUrl(userinfo.avatarUrl!)" size="lg" alt="Avatar" />
      </UFormGroup>
      <UFormGroup label="密码" name="password" hint="留空则不修改密码">
        <UInput v-model="state.password" type="password" />
      </UFormGroup>
      <UFormGroup label="邮箱" name="email" hint="请使用常用邮箱,会用来生成头像">
        <UInput v-model="state.email" type="text" />
      </UFormGroup>
      <UFormGroup label="自定义css" name="css">
        <UTextarea v-model="state.css" />
      </UFormGroup>
      <UButton type="submit">
        保存
      </UButton>
    </UForm>
  </UCard>
</template>

<script lang="ts" setup>
import type { FormSubmitEvent } from '#ui/types';
import { toast } from 'vue-sonner';
import { z } from 'zod';
import type { UserDTO } from '~/types';
import { saveSettingsRequestSchema } from '~/types';


const { data } = await useFetch(`/api/user/profile`, { method: 'POST' })
const userinfo = data.value as UserDTO
const config = useRuntimeConfig()

type Schema = z.output<typeof saveSettingsRequestSchema>

const state = reactive({
  email: userinfo.email,
  password: undefined,
  css: undefined,
})

async function onSubmit(event: FormSubmitEvent<Schema>) {
  await $fetch('/api/user/saveSettings', {
    method: "POST",
    body: JSON.stringify(event.data)
  })
  if (event.data.password) {
    toast.success('密码修改成功,请重新登录')    
    await refreshCookie(config.public.tokenKey)
    await navigateTo('/user/login')
  }else{
    toast.success('修改成功')
  }
}
</script>

<style scoped></style>