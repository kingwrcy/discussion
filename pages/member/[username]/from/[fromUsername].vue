<script lang="ts" setup>
const route = useRoute()
const username = route.params.fromUsername as string

onMounted(() => {
  userCardChanged.emit()
})
</script>

<template>
  <XPrivateMsgList :from-username="username" />
  <XSendMsg :to-username="username" @send-msg-success="sendMsgSuccessed.emit()" />
</template>

<style scoped>

</style>
