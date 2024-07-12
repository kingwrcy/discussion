<script lang="ts" setup>
import { toast } from 'vue-sonner'
import type { SysConfigDTO } from '~/types'

const route = useRoute()
const username = route.params.username as string

const state = reactive({
  content: '',
  toUser: username,
})
const pending = ref(false)
const global = useGlobalConfig()
const sysconfig = global.value?.sysConfig as SysConfigDTO

async function sendMsg() {
  pending.value = true
  if (sysconfig.googleRecaptcha && sysconfig.googleRecaptcha.enable) {
    grecaptcha.ready(() => {
      grecaptcha.execute(sysconfig.googleRecaptcha.siteKey, { action: 'sendMsg' }).then(async (token) => {
        await doSendMsg(token)
        pending.value = false
      })
    })
  }
  else {
    await doSendMsg()
    pending.value = false
  }
}

async function doSendMsg(token?: string) {
  const { success, message } = await $fetch('/api/member/sendMsg', {
    method: 'POST',
    body: JSON.stringify({
      content: state.content,
      toUser: state.toUser,
      token,
    }),
  })
  if (success) {
    toast.success(message)
    state.content = ''
    await navigateTo(`/member/${username}`)
  }
  else {
    toast.error(message)
  }
}
</script>

<template>
  <div class="flex flex-col gap-2">
    <UTextarea v-model="state.content" color="white" variant="outline" :rows="5" autoresize padded :placeholder="`发送私信给${username}`" />
    <UButton color="primary" class="w-fit" @click="sendMsg">
      发送私信
    </UButton>
  </div>
</template>

<style scoped>

</style>
