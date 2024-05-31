import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'

import zhCn from 'dayjs/locale/zh-cn'

dayjs.extend(relativeTime).locale(zhCn)

export const getAvatarUrl = (hash: string) => {
  const config = useRuntimeConfig();
  return `${config.public.avatarCdn}${hash}?d=identicon`;
};

export const dateFormat = (date: Date | number | string,pattern:string = 'YYYY-MM-DD HH:mm:ss') => {
  return dayjs(date).format(pattern);
};

export const dateFormatAgo = (date: Date | number| string) => {
  return dayjs(date).fromNow();
};


export const onUploadImg = async (files:File[], callback:any)=>{
  const res = await Promise.all(files.map(async f=>{
    const form = new FormData();
    form.append('image', f);

    // 设置请求头
    const headers = {
      'Auth-Token': 'UrQsI696geWByeif6s34dFkmiTYrCV4dpMIk1qZlPYoPr8AfuQ'
    };

    try {
      // 发送 POST 请求
      const response = await $fetch('https://i.111666.best/image', {
        method: 'POST',
        body: form,
        headers
      });

      console.log('Response:', response);
    } catch (error) {
      console.error('Error:', error);
    }
  }))

}