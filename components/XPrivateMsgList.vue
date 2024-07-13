<script lang="ts" setup>
import type { MessageDTO, UserDTO } from '~/types'
import { sendMsgSuccessed } from '~/utils/eventbus'

const props = defineProps({
  fromUsername: String,
})

const container = ref<HTMLElement | null>(null)

const currentUser = useState<UserDTO>('userinfo')
const { y } = useScroll(container)

const res = await useFetch('/api/member/privateMsgList', {
  method: 'POST',
  body: JSON.stringify({
    fromUsername: props.fromUsername,
  }),
})

onMounted(() => {
  y.value = 99999
})

const detailList = ref(res?.data.value?.list as any as MessageDTO[])
async function showPrivateDetail() {
  const result = await $fetch('/api/member/privateMsgList', {
    method: 'POST',
    body: JSON.stringify({
      fromUsername: props.fromUsername,
    }),
  })
  if (result.success) {
    detailList.value = result.list as any as MessageDTO[]
    setTimeout(() => {
      y.value = 99999
    }, 0)
  }
}

sendMsgSuccessed.on(async () => {
  await showPrivateDetail()
})
</script>

<template>
  <div class="flex justify-between items-center text-sm">
    <div>与 <span class="text-green-500 font-semibold">{{ props.fromUsername }}</span> 的对话 <span class="text-gray-400 text-xs">(只显示最后50条)</span> </div>
    <UButton size="xs" color="white" class="my-4" :to="`/member/${currentUser.username}/privateMsg`">
      返回私信列表
    </UButton>
  </div>

  <div ref="container" class="flex flex-col gap-2 border b-solid border-gray-200 dark:border-gray-600  rounded bg-gray-200 dark:bg-slate-900  text-sm max-h-[500px] overflow-auto py-2">
    <div v-for="item in detailList" :key="item.id" class="px-6">
      <div class="text-gray-400 text-xs" :class="[item.from.username === currentUser.username ? 'text-right' : '']">
        {{ dateFormat(item.createdAt) }}
      </div>
      <div class="flex gap-2 items-start my-2" :class="[item.from.username === currentUser.username ? 'flex-row-reverse' : '']">
        <UAvatar :src="getAvatarUrl(item.from.avatarUrl!, item.from.headImg)" size="lg" alt="Avatar" />
        <div class=" bg-white rounded dark:bg-slate-600 p-2 shadow max-w-[500px] text-wrap">
          {{ item.content }}
        </div>
      </div>
    </div>
  </div>
  <UDivider class="my-4" />
</template>

<style scoped>

</style>
