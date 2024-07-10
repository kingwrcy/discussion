<script lang="ts" setup>
import { toast } from 'vue-sonner'
import type { z } from 'zod'
import type { FormSubmitEvent } from '#ui/types'
import { type SysConfigDTO, loginRequestSchema } from '~/types'

useHead({
  title: `登录`,
})

type Schema = z.output<typeof loginRequestSchema>

const state = reactive<Schema>({
  password: '',
  username: '',
})
const pending = ref(false)
const global = useGlobalConfig()
const sysconfig = global.value?.sysConfig as SysConfigDTO

async function onSubmit(event: FormSubmitEvent<Schema>) {
  pending.value = true
  if (sysconfig.googleRecaptcha && sysconfig.googleRecaptcha.enable) {
    grecaptcha.ready(() => {
      grecaptcha.execute(sysconfig.googleRecaptcha.siteKey, { action: 'login' }).then(async (token) => {
        await login(event.data, token)
        pending.value = false
      })
    })
  }
  else {
    await login(event.data)
    pending.value = false
  }
}

async function login(data: Schema, token: string = '') {
  const result = await $fetch('/api/member/login', {
    method: 'POST',
    body: JSON.stringify({ ...data, token }),
  })
  if (result.success && 'tokenKey' in result) {
    toast.success(`登录成功,自动跳转中...`)
    location.href = '/'
  }
  else if ('message' in result) {
    toast.error(`登录失败,${result.message}`)
  }
}
</script>

<template>
  <UCard class="w-full mt-2">
    <template #header>
      <div class="text-center text-sm">
        登录
      </div>
    </template>
    <div class="flex flex-col my-2 lg:w-[300px] mx-auto">
      <UForm
        :schema="loginRequestSchema" :state="state" :validate-on="['submit']" class="space-y-4" autocomplete="off"
        @submit="onSubmit"
      >
        <UFormGroup label="用户名" name="username">
          <UInput v-model="state.username" autocomplete="off" />
        </UFormGroup>
        <UFormGroup label="密码" name="password">
          <UInput v-model="state.password" type="password" autocomplete="off" />
        </UFormGroup>
        <div class="flex gap-2 items-center">
          <UButton type="submit" :loading="pending" :disabled="pending">
            登录
          </UButton>
          <UButton color="gray" variant="solid" class="button" @click="navigateTo('/member/forgotPassword')">
            忘记密码了
          </UButton>

          <NuxtLink to="/member/reg" class="text-primary text-sm ml-2 underline underline-offset-4">
            没有账户?去注册
          </NuxtLink>
        </div>
      </UForm>
    </div>
  </UCard>
</template>

<style scoped></style>
