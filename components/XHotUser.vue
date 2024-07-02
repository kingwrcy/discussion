<script lang="ts" setup>
const { data: hotUsers } = await useFetch('/api/member/hot', { method: 'post', key: 'hotUsers' })
</script>

<template>
  <UCard v-if="hotUsers && hotUsers.length > 0" class="w-full mt-2" :ui="{ header: { padding: 'px-0 py-0 sm:px-0' }, body: { padding: 'px-0 py-0 sm:px-0' } }">
    <template #header>
      <div class="px-4 items-center flex justify-between py-1 rounded-t sm:px-6 text-primary bg-gray-100 dark:bg-slate-500">
        <div>活跃用户</div>
        <div class="text-sm">
          近三天获得积分
        </div>
      </div>
    </template>
    <div class="py-1  rounded-t sm:px-6 text-primary ">
      <div class="flex flex-col border rounded dark:border-slate-700">
        <NuxtLink
          v-for="(user, index) in hotUsers" :key="user.uid" :to="`/member/${user.username}`"
          class="cursor-pointer hover:bg-slate-50 border-b dark:border-slate-700 p-2 flex gap-x-4 text-sm items-center"
        >
          <div class="flex items-center gap-x-2 font-bold">
            <UAvatar :src="getAvatarUrl(user.avatarUrl!, user.headImg)" size="xs" alt="Avatar" />
            <span>{{ user.username }}</span>
          </div>
          <span>{{ user.points }}分</span>
          <div class="ml-auto" :class="{ 'text-yellow-400': index === 0, 'text-blue-400': index === 1, 'text-green-400': index === 2 }">
            #{{ index + 1 }}
          </div>
        </NuxtLink>
      </div>
    </div>
  </UCard>
</template>

<style scoped></style>
