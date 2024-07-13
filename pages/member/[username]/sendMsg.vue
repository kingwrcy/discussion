<script lang="ts" setup>
import type { UserDTO } from '~/types'

const route = useRoute()
const username = route.params.username as string
async function sendMsgSuccess() {
  await navigateTo(`/member/${username}/privateMsgList`)
}
</script>

<template>
  <XSendMsg :to-username="username" @send-msg-success="sendMsgSuccess" />
</template>

<style scoped>

</style>
