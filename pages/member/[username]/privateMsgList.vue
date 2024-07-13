<script lang="ts" setup>
import { sendMsgSuccessed } from '~/utils/eventbus'

const route = useRoute()
const username = route.params.fromUsername as string
</script>

<template>
  <div>
    <XPrivateMsgList :from-username="username" />
    <XSendMsg :to-username="username" @send-msg-success="sendMsgSuccessed.emit()" />
  </div>
</template>

<style scoped></style>
