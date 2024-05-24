<template>
  <div class="px-4 flex space-x-2  items-start py-2 ">
    <NuxtLink :to="`/member/${author.username}`">
      <UAvatar v-if="author && author.avatarUrl" :src="getAvatarUrl(author.avatarUrl)" size="lg" alt="Avatar" />
    </NuxtLink>
    <div class="flex-1 space-y-2">
      <div class="flex space-x-4 text-xs mt-1 text-gray-500">
        <div class="flex  items-center space-x-1 cursor-pointer hover:text-primary/80 font-semibold">
          <UIcon name="i-carbon-user" />
          <NuxtLink :to="`/member/${author.username}`">{{ author.username }} </NuxtLink>
        </div>

        <div class="flex items-center space-x-1 text-primary/40">
          <UIcon name="i-carbon-time" />
          <span>{{ dateFormatAgo(createdAt) }}</span>
        </div>
        <div v-if="token && userinfo && userinfo.uid !== props.author.uid" title="支持"
          class="flex gap-.5 items-center space-x-1 hover:text-primary/80 cursor-pointer" @click="doLike">
          <UIcon name="i-carbon-favorite" :class="[state.like ? 'text-red-500' : '']" />
          <span>{{ state.likeCount ?? 0 }}</span>
        </div>
        <div v-if="token && userinfo && userinfo.uid !== props.author.uid" title="反对"
          class="flex gap-.5 items-center space-x-1 hover:text-primary/80 cursor-pointer" @click="doDisLike">
          <UIcon name="i-carbon-thumbs-down" :class="[state.dislike ? 'text-yellow-500' : '']" />
          <span>{{ state.dislikeCount ?? 0 }}</span>
        </div>
      </div>
      <div class="text-gray-600  text-sm  hover:text-primary/80">
        <MdPreview :model-value="content" :editor-id="cid" />
      </div>
    </div>

    <div class="text-xs text-primary/40 select-none cursor-pointer" v-if="route.fullPath.startsWith('/post')">#{{
      props.floor }}</div>
  </div>
</template>

<script lang="ts" setup>
import { MdPreview } from "md-editor-v3";
import type { CommentDTO, UserDTO } from "~/types";

const userinfo = useState<UserDTO | undefined>('userinfo')
const config = useRuntimeConfig()
const token = useCookie(config.public.tokenKey)

const props = defineProps<CommentDTO>();
const route = useRoute()
const state = reactive({
  likeCount: props.likeCount,
  dislikeCount: props.dislikeCount,
  like: props.like,
  dislike: props.dislike,
});

const doLike = async () => {
  const res = await $fetch(`/api/comment/like?cid=${props.cid}`, {
    method: "POST",
  });
  Object.assign(state, res)
  userCardChanged.emit()
}

const doDisLike = async () => {
  const res = await $fetch(`/api/comment/dislike?cid=${props.cid}`, {
    method: "POST",
  });
  Object.assign(state, res)
  userCardChanged.emit()
}
</script>
<style scoped></style>
