<script lang="ts" setup>
defineProps({
  message: {
    type: String,
    default: '你确定要为他点赞吗？这将会扣除你1积分。',
  },
})

const emit = defineEmits(['success', 'cancel'])

function onSuccess() {
  emit('success')
}
function onCancel() {
  emit('cancel')
}
</script>

<template>
  <UModal :overlay="false">
    <UCard>
      <div class="text-center my-4">
        <p>提示: {{ message }}</p>
      </div>
      <div class="text-center my-2">
        <UButton class="mr-4" @click="onCancel">
          取消
        </UButton>
        <UButton @click="onSuccess">
          确定
        </UButton>
      </div>
    </UCard>
  </UModal>
</template>
