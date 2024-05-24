import { formatDate, formatDistanceAgo } from "vtils/date";

export const getAvatarUrl = (hash: string) => {
  const config = useRuntimeConfig();
  return `${config.public.avatarCdn}${hash}?d=identicon`;
};

export const dateFormat = (date: Date | number | string,pattern:string = 'yyyy-MM-dd HH:mm:ss') => {
  return formatDate(new Date(date), pattern);
};

export const dateFormatAgo = (date: Date | number| string) => {
  return formatDistanceAgo(new Date(date));
};
