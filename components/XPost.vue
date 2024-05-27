<template>
  <div class="flex space-x-3  items-start py-2" :class="{ 'sm:px-4 px-2': route.fullPath === '/' }">

    <NuxtLink :to="`/member/${author.username}`" v-if="showAvatar">
      <UAvatar v-if="author && author.avatarUrl" :src="getAvatarUrl(author.avatarUrl)" size="lg" alt="Avatar" />
    </NuxtLink>
    <div class="flex-1">
      <div v-if="detailPage" :to="`/post/${props.pid}`" class="dark:text-slate-50 dark:hover:text-slate-300 text-gray-600 w-fit">
        <div class="text-2xl" :class="{ 'line-clamp-1': !detailPage }">{{ title }}
        </div>
      </div>
      <NuxtLink v-else :to="`/post/${props.pid}`"
        class="text-gray-600 dark:text-slate-50 dark:hover:text-slate-300 flex items-center  cursor-pointer  hover:text-primary/80 w-fit">
        <div>{{ title }}</div>
        <UIcon v-if="props.pinned" name="i-carbon-pin-filled" class="ml-1 text-primary"></UIcon>
      </NuxtLink>

      <div class="flex space-x-2 text-xs mt-1 text-gray-500 items-center">
        <div class="flex items-center space-x-1  cursor-pointer" v-if="route.fullPath.startsWith('/post')" @click="doSupport()"> 
          <UIcon name="i-carbon-chevron-up" v-if="!props.support" title="支持" ></UIcon>
          <UIcon name="i-carbon-chevron-down" v-else="props.support" title="不支持" ></UIcon>
          <span v-if="props._count.PostSupport > 0">{{ props._count.PostSupport }}</span>
        </div>

        <UBadge color="gray" variant="soft" size="xs" class="text-xs cursor-pointer hover:bg-gray-100">
          <NuxtLink :to="`/tag/${props.tag.name}`">{{ props.tag.name }}</NuxtLink>
        </UBadge>

        <div class="font-semibold flex items-center space-x-1 ">
          <div class="cursor-pointer flex items-center space-x-1 hover:text-primary/50">
            <UIcon name="i-carbon-user" />
            <NuxtLink :to="`/member/${author.username}`">
              <span class="inline-block">{{ author.username }}</span>
            </NuxtLink>
          </div>
          <!-- <span v-if="author.role === UserRole.ADMIN"
            class="text-[11px] ml-1 bg-green-500 text-white rounded px-1">mod</span> -->
        </div>
        <div :to="`/post/${props.pid}`" class="flex items-center space-x-1 text-primary/40">
          <UIcon name="i-carbon-view" />
          <span>{{ viewCount }}</span>
        </div>
        <div class="flex items-center space-x-1 text-primary/40">
          <UIcon name="i-carbon-time" />
          <span v-if="!route.fullPath.startsWith('/post')">{{ dateFormatAgo(props.lastCommentTime || createdAt) }}</span>
          <span v-else>{{ dateFormatAgo(createdAt) }}</span>
        </div>
        <div class="flex items-center space-x-1 text-primary/40" v-if="props.lastCommentUser" title="最后回复人">
          <UIcon name="i-carbon-download-study"></UIcon>
          <NuxtLink :to="`/member/${props.lastCommentUser.username}`"
            class="cursor-pointer hover:text-primary/50 font-bold">
            <span class="inline-block text-primary/70">{{ props.lastCommentUser.username }}</span>
          </NuxtLink>
        </div>
      </div>
    </div>

    <div class="hidden md:block">
      <UBadge variant="soft" size="lg">
        <NuxtLink :to="`/post/${props.pid}`" class="flex items-center space-x-1  cursor-pointer ">
          <UIcon name="i-carbon-book" />
          <span>{{ replyCount }}</span>
        </NuxtLink>
      </UBadge>
      
    </div>

  </div>
</template>

<script lang="ts" setup>
import type { PostDTO } from '~/types';

const route = useRoute()
const detailPage = route.fullPath.startsWith('/post')

const emit = defineEmits(['support'])

const props = withDefaults(defineProps<PostDTO & {
  showAvatar: boolean
}>(), {
  showAvatar: true,
  fav: false
})

const doSupport = ()=>{
  emit('support', props.pid)
}

</script>

<style scoped></style>