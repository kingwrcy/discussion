<script lang="ts" setup>
import type { z } from 'zod'
import { toast } from 'vue-sonner'
import type { FormSubmitEvent } from '#ui/types'
import { regRequestSchema } from '~/types'
import type { SysConfigDTO } from '~/types'

type Schema = z.output<typeof regRequestSchema>

useHead({
  title: `注册用户`,
})
const config = useGlobalConfig()
const state = reactive<Schema>({
  email: '',
  password: '',
  username: '',
  repeatPassword: '',
  inviteCode: '',
  emailCode: '',
  emailCodeKey: '',
})
const pending = ref(false)
const emailSending = ref(false)
const global = useGlobalConfig()
const sysconfig = global.value?.sysConfig as SysConfigDTO

async function doReg(data: Schema, token: string = '') {
  const result = await $fetch('/api/member/reg', {
    method: 'POST',
    body: JSON.stringify({ ...data, token }),
  })
  if (result.success) {
    toast.success('注册成功,去登录吧')
    navigateTo('/member/login')
  }
  else if ('message' in result) {
    toast.error(`注册失败,${result.message}`)
  }
}

async function onSubmit(event: FormSubmitEvent<Schema>) {
  pending.value = true
  if (sysconfig.googleRecaptcha && sysconfig.googleRecaptcha.enable) {
    grecaptcha.ready(() => {
      grecaptcha.execute(sysconfig.googleRecaptcha.siteKey, { action: 'reg' }).then(async (token) => {
        await doReg(event.data, token)
      })
    })
  }
  else {
    await doReg(event.data)
  }
  pending.value = false
}

async function sendEmail() {
  emailSending.value = true
  const { success, emailCodeKey, message } = await $fetch('/api/member/sendEmail', {
    method: 'POST',
    body: JSON.stringify({ email: state.email, sence: 'REGISTER' }),
  })
  if (success) {
    state.emailCodeKey = emailCodeKey
    toast.success(message)
  }
  else {
    toast.error(message)
  }
  emailSending.value = false
}
</script>

<template>
  <UCard class="w-full mt-2">
    <template #header>
      <div class="text-center text-sm">
        注册用户
      </div>
    </template>
    <div class="flex flex-col my-2 lg:w-[300px] mx-auto">
      <UForm
        :schema="regRequestSchema" :state="state" :validate-on="['submit']" class="space-y-4" autocomplete="off"
        @submit="onSubmit"
      >
        <UFormGroup label="用户名" name="username">
          <UInput v-model="state.username" autocomplete="off" />
        </UFormGroup>
        <UFormGroup label="邮箱" name="email" hint="请使用常用邮箱,会用来生成头像">
          <UButtonGroup v-if="config.sysConfig.regWithEmailCodeVerify">
            <UInput v-model="state.email" autocomplete="off" />
            <UButton type="button" :loading="emailSending" @click="sendEmail">
              发送邮件
            </UButton>
          </UButtonGroup>
          <UInput v-else v-model="state.email" autocomplete="off" />
        </UFormGroup>
        <UFormGroup v-if="config.sysConfig.regWithEmailCodeVerify" label="邮箱验证码" name="emailCode">
          <UInput v-model="state.emailCode" autocomplete="off" />
        </UFormGroup>
        <UFormGroup label="密码" name="password">
          <UInput v-model="state.password" type="password" autocomplete="off" />
        </UFormGroup>
        <UFormGroup label="重复密码" name="repeatPassword">
          <UInput v-model="state.repeatPassword" type="password" autocomplete="off" />
        </UFormGroup>
        <UFormGroup v-if="config.sysConfig.invite" label="邀请码" name="inviteCode">
          <UInput v-model="state.inviteCode" autocomplete="off" />
        </UFormGroup>
        <div>
          <UButton type="submit" :loading="pending">
            注册账户
          </UButton>
          <NuxtLink to="/member/login" class="text-primary text-sm ml-2 underline underline-offset-4">
            已有账户?去登录
          </NuxtLink>
        </div>
      </UForm>
    </div>
  </UCard>
</template>

<style scoped></style>
