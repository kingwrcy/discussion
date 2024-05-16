<template>
  <UCard class="w-full mt-2">
    <template #header >
        <XPost v-bind="post"/>
        <div class="my-4 text-sm leading-5" v-html="post.content"></div>
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
    content:`如题，想问问，大家的学生包稳吗，维持多长时间？<br/>
如果是大部分都不稳定，就不再试了。<br/>
如果有稳定的，推荐一下店铺。`,
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