<script lang="ts" setup>
import type { PostDTO } from '~/types'

const props = withDefaults(defineProps<PostDTO & {
  showAvatar: boolean
}>(), {
  showAvatar: true,
  fav: false,
})
const emit = defineEmits(['support'])
const route = useRoute()
const detailPage = route.fullPath.startsWith('/post')

function doSupport() {
  emit('support', props.pid)
}
</script>

<template>
  <div
    class="flex space-x-3 items-start py-2 sm:px-4 px-2"
  >
    <NuxtLink v-if="showAvatar" :to="`/member/${author.username}`">
      <UAvatar v-if="author && author.avatarUrl" :src="getAvatarUrl(author.avatarUrl, author.headImg)" size="lg" alt="Avatar" />
    </NuxtLink>
    <div class="flex-1">
      <div
        v-if="detailPage" :to="`/post/${props.pid}`"
        class="dark:text-slate-50 dark:hover:text-slate-300 text-gray-600 w-fit"
      >
        <div class="text-2xl" :class="{ 'line-clamp-1': !detailPage }">
          {{ title }}
        </div>
      </div>
      <NuxtLink
        v-else :to="`/post/${props.pid}`"
        class="text-gray-600 dark:text-slate-50 dark:hover:text-slate-300 flex items-center  cursor-pointer  hover:text-primary/80 w-fit"
      >
        <div>
          <span class="mr-4">{{ title }}</span>
          <span v-if="props.readRole && props.readRole > 0 && props.readRole <= 999" class="text-red-500 text-sm">
            <UIcon class="align-middle" name="i-carbon-locked" />
            <span class="align-middle">{{ props.readRole < 999 ? props.readRole : '私有' }}</span>
          </span>

          <span
            :to="`/post/${props.pid}`"
            class="inline-flex md:hidden text-xs text-primary/80 items-center space-x-1  cursor-pointer "
          >
            <UIcon name="i-carbon-book" />
            <span>{{ replyCount }}</span>
          </span>
        </div>

        <UIcon v-if="props.pinned" name="i-carbon-pin-filled" class="ml-1 text-primary" />
      </NuxtLink>

      <div class="flex space-x-2 text-xs mt-1 text-gray-500 items-center">
        <div
          v-if="route.fullPath.startsWith('/post')" class="flex items-center space-x-1  cursor-pointer"
          @click="doSupport()"
        >
          <UIcon v-if="!props.support" name="i-carbon-chevron-up" title="支持" />
          <UIcon v-else name="i-carbon-chevron-down" title="不支持" />
          <span v-if="props._count.PostSupport > 0">{{ props._count.PostSupport }}</span>
        </div>

        <UBadge color="gray" variant="soft" size="xs" class="text-xs cursor-pointer hover:bg-gray-100">
          <NuxtLink :to="`/go/${props.tag.enName}`">
            {{ props.tag.name }}
          </NuxtLink>
        </UBadge>

        <div class="font-semibold flex items-center space-x-1 ">
          <div class="cursor-pointer flex items-center space-x-1 hover:text-primary/50">
            <UIcon name="i-carbon-user" />
            <NuxtLink :to="`/member/${author.username}`">
              <span class="inline-block">{{ author.username }}</span>
            </NuxtLink>
            <UBadge v-for="(t, index) in author.titles" :key="index" size="xs" :color="t.style">
              {{ t.title }}
            </UBadge>
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
          <span v-if="!route.fullPath.startsWith('/post')">{{ dateFormatAgo(props.lastCommentTime || createdAt)
          }}</span>
          <span v-else>{{ dateFormatAgo(createdAt) }}</span>
        </div>
        <div v-if="props.lastCommentUser" class="hidden md:flex items-center space-x-1 text-primary/40" title="最后回复人">
          <UIcon name="i-carbon-download-study" />
          <NuxtLink
            :to="`/member/${props.lastCommentUser.username}`"
            class="cursor-pointer hover:text-primary/50 font-bold"
          >
            <span class="inline-block text-primary/70">{{ props.lastCommentUser.username }}</span>
          </NuxtLink>
        </div>
        <XUserSig v-if="author.signature" :signature="author.signature" class="ml-4 hidden" />
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

<style scoped></style>
