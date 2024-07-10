<script lang="ts" setup>
import { MdPreview } from 'md-editor-v3'
import { UserRole } from '@prisma/client'
import { useWindowScroll } from '@vueuse/core'
import { toast } from 'vue-sonner'
import XTipModal from './XTipModal.vue'
import type { CommentDTO, UserDTO } from '~/types'

const props = defineProps<CommentDTO>()
const userinfo = useState<UserDTO | undefined>('userinfo')
const config = useRuntimeConfig()
const token = useCookie(config.public.tokenKey)
const { y } = useWindowScroll({ behavior: 'auto' })

const route = useRoute()
const state = reactive({
  like: props.like,
  dislike: props.dislike,
  likeCount: props.likeCount,
  dislikeCount: props.dislikeCount,
})

function updateQo(create = true) {
  y.value = 999999999999
  commentQuoted.emit({
    username: props.author.username,
    pid: props.post!.pid!,
    floor: props.floor,
    content: create ? '' : props.content,
    cid: create ? '' : props.cid,
  })
}

async function doLike() {
  if (token && userinfo && userinfo.value?.uid !== props.author.uid) {
    if (state.like || state.dislike)
      return toast.warning('你已经表过态了！')
    const confirmed = await openModal('你确定要为他点赞吗？这将会扣除你1积分。')
    if (!confirmed)
      return
    const res = await $fetch(`/api/comment/like?cid=${props.cid}`, {
      method: 'POST',
    })
    Object.assign(state, res)
    userCardChanged.emit()
  }
}

async function doDisLike() {
  if (token && userinfo && userinfo.value?.uid !== props.author.uid) {
    if (state.like || state.dislike)
      return toast.warning('你已经表过态了！')
    const confirmed = await openModal('你确定要为他点踩吗？这将会扣除你1积分。')
    if (!confirmed)
      return
    const res = await $fetch(`/api/comment/dislike?cid=${props.cid}`, {
      method: 'POST',
    })
    Object.assign(state, res)
    userCardChanged.emit()
  }
}

const modal = useModal()
function openModal(message: string) {
  return new Promise((resolve) => {
    modal.open(XTipModal, {
      message,
      onSuccess() {
        modal.close()
        resolve(true)
      },
      onCancel() {
        modal.close()
        resolve(false)
      },
    })
  })
}
const color = useColorMode()
const theme = ref<'light' | 'dark'>(color.value === 'dark' ? 'dark' : 'light')
themeChanged.on((val) => {
  theme.value = val === 'dark' ? 'dark' : 'light'
})
</script>

<template>
  <div :id="`${props.floor}`" class="relative px-4 flex space-x-2  items-start py-2 comment">
    <NuxtLink :to="`/member/${author.username}`">
      <UAvatar v-if="author && author.avatarUrl" :src="getAvatarUrl(author.avatarUrl, author.headImg)" size="lg" alt="Avatar" />
    </NuxtLink>
    <div class="flex-1 space-y-2 ">
      <div class="flex text-xs mt-1 text-gray-500 flex-wrap gap-2 max-w-[90%]">
        <div class="flex  items-center space-x-1 cursor-pointer hover:text-primary/80 font-semibold">
          <UIcon name="i-carbon-user" />
          <NuxtLink :to="`/member/${author.username}`">
            {{ author.username }}
          </NuxtLink>
          <UBadge v-for="(t, index) in author.titles" :key="index" size="xs" :color="t.style">
            {{ t.title }}
          </UBadge>
          <span
            v-if="author.uid === post!.uid"
            class="text-[11px] ml-1 bg-gray-500 text-white rounded px-1"
          >楼主</span>
          <span
            v-if="author.role === UserRole.ADMIN"
            class="text-[11px] ml-1 bg-green-500 text-white rounded px-1"
          >mod</span>
        </div>

        <div class="flex items-center space-x-1 text-primary/40">
          <UIcon name="i-carbon-time" />
          <span>{{ dateFormatAgo(createdAt) }}</span>
        </div>
        <div v-if="createdAt !== updatedAt" class="items-center space-x-1 text-primary/40 hidden md:flex">
          <UIcon name="i-carbon-time" />
          <span>edited {{ dateFormatAgo(updatedAt) }}</span>
        </div>
        <div title="支持" class="flex gap-.5 items-center space-x-1 hover:text-primary/80 cursor-pointer" @click="doLike">
          <UIcon name="i-carbon-favorite" :class="[state.like ? 'text-red-500' : '']" />
          <span>{{ state.likeCount ?? 0 }}</span>
        </div>
        <div
          title="反对" class="flex gap-.5 items-center space-x-1 hover:text-primary/80 cursor-pointer"
          @click="doDisLike"
        >
          <UIcon name="i-carbon-thumbs-down" :class="[state.dislike ? 'text-yellow-500' : '']" />
          <span>{{ state.dislikeCount ?? 0 }}</span>
        </div>
        <div
          v-if="token && userinfo && userinfo.uid !== props.author.uid"
          class="flex gap-.5 items-center space-x-1 hover:text-primary/80 cursor-pointer" @click="updateQo()"
        >
          <UIcon name="i-carbon-reply" />
          回复
        </div>
        <div v-if="token && userinfo && userinfo.uid === props.author.uid" class="flex gap-.5 items-center space-x-1 hover:text-primary/80 cursor-pointer" @click="updateQo(false)">
          <UIcon name="i-carbon-edit" />
          编辑
        </div>
      </div>
      <div class="text-gray-600  text-sm  hover:text-primary/80">
        <MdPreview :model-value="content" :editor-id="cid" no-mermaid no-katex :theme="theme" />
      </div>
    </div>

    <div class="absolute right-2 top-2">
      <div class="flex md:gap-x-2 items-center">
        <XUserSig v-if="author.signature" :signature="author.signature" />
        <a v-if="route.fullPath.startsWith('/post')" :id="`${props.floor}`" class="md:ml-4 text-sm text-primary/40 select-none cursor-pointer" :href="`#${props.floor}`">#{{ props.floor }}</a>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
