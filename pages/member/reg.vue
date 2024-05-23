<template>
  <UCard class="w-full mt-2">
    <template #header class="py-1">
      <div class="text-center text-sm">注册用户</div>
    </template>
    <div class="flex flex-col my-2 lg:w-[300px] mx-auto">
      <UForm :schema="regRequestSchema" :state="state" :validate-on="['submit']" class="space-y-4" @submit="onSubmit"
        autocomplete="off">
        <UFormGroup label="用户名" name="username">
          <UInput v-model="state.username" autocomplete="off" />
        </UFormGroup>
        <UFormGroup label="邮箱" name="email" hint="请使用常用邮箱,会用来生成头像">
          <UInput v-model="state.email" autocomplete="off" />
        </UFormGroup>
        <UFormGroup label="密码" name="password">
          <UInput v-model="state.password" type="password" autocomplete="on" />
        </UFormGroup>
        <UFormGroup label="重复密码" name="repeatPassword">
          <UInput v-model="state.repeatPassword" type="password" autocomplete="on" />
        </UFormGroup>
        <div>
          <UButton type="submit" :loading="pending">
            注册账户
          </UButton>
          <NuxtLink to="/member/login" class="text-primary text-sm ml-2 underline underline-offset-4">已有账户?去登录
          </NuxtLink>
        </div>
      </UForm>
    </div>


  </UCard>
</template>

<script lang="ts" setup>
import { z } from 'zod'
import type { FormSubmitEvent } from '#ui/types'
import { regRequestSchema } from '~/types';
import { toast } from 'vue-sonner';

type Schema = z.output<typeof regRequestSchema>

useHead({
  title: `注册用户`,
  meta: [
    { name: "keywords", content: "极简论坛" },
    { name: "description", content: "极简论坛" },
  ],
})

const state = reactive<Schema>({
  email: "",
  password: "",
  username: "",
  repeatPassword: ""
})
const pending = ref(false)

async function onSubmit(event: FormSubmitEvent<Schema>) {
  pending.value = true
  const result = await $fetch('/api/member/reg', {
    method: 'POST',
    body: JSON.stringify(event.data)
  })
  if (result.success) {
    toast.success('注册成功,去登录吧')
    navigateTo('/member/login')
  } else if ('message' in result) {
    toast.error('注册失败,' + (result.message))
  }
  pending.value = false
}
</script>

<style scoped></style>