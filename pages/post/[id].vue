<template>
  <UCard class="w-full mt-2">
    <template #header >
        <XPost v-bind="post"/>
        <div class="my-2 text-sm">{{ post.content }}</div>
    </template>
  </UCard>
</template>

<script lang="ts" setup>
import dayjs from 'dayjs';
import type { Post } from '~/types';

const post = ref<Post>({
    id:1,
    pinned:true,
    title:'我准备封存账号,然后nastool签到保号',
    content:'hi~我是UserCloud的Sales，我們這邊或許有一些產品是符合您的期待的，或許您可以來逛逛我們也有獨服業務，如果您想了解可以連絡我的TG:@qian40',
    author:{
      name:"JerryWang",
      avatar:'https://cdn.v2ex.com/avatar/b278/8fc2/634609_xlarge.png?m=1712121309'
    },
    created:dayjs().subtract(1,'D').toDate(),
    views:20,
    comments:32,
    tag:{
      name:'XBlog'
    }
  })
</script>

<style scoped></style>