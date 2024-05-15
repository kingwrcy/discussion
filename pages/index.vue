<template>
  <UCard class="w-full mt-2">
    <template #header class="py-1">
      <XTagList />
    </template>
    <div class="flex flex-col my-2">
      <XPost v-for="post in posts" :key="post.id" v-bind="post"/>
    </div>
    <UPagination v-model="page" :page-count="5" :total="items.length" />

  </UCard>
</template>

<script lang="ts" setup>
import dayjs from 'dayjs';
import type { Post } from '~/types';



const posts = reactive<Post[]>([
  {
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
  },
  {
    id:2,
    title:'有没有能稳定解锁chatgpt的鸡？速度要快韩国日本的最好',
    content:'@kindletui2023 #5 这机子真的可以嘛',
    author:{
      name:"rockyli",
      avatar:'https://www.nodeseek.com/avatar/3509.png'
    },
    created:dayjs().subtract(1,'D').toDate(),
    views:2,
    comments:3,
    tag:{
      name:'Moments'
    }
  },
  {
    id:3,
    title:'最近三年面了三百多人，给程序员和面试官们分享一下我的感受',
    content:'rt，想当落地用，预算大概200以内',
    author:{
      name:"Tsing2",
      avatar:'https://cdn.v2ex.com/avatar/517f/62b2/19231_xlarge.png?m=1715755537'
    },
    created:dayjs().subtract(1,'hour').toDate(),
    views:31,
    comments:30,
    tag:{
      name:'Badge'
    }
  }
])
const page = ref(1)
const items = ref(Array(55))
</script>

<style></style>