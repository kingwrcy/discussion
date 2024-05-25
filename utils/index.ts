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
