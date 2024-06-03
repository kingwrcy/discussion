import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

import zhCn from "dayjs/locale/zh-cn";
import { toast } from "vue-sonner";
import { uuid } from "short-uuid";

dayjs.extend(relativeTime).locale(zhCn);

export const getAvatarUrl = (hash: string) => {
  const config = useRuntimeConfig();
  return `${config.public.avatarCdn}${hash}?d=identicon`;
};

export const dateFormat = (
  date: Date | number | string,
  pattern: string = "YYYY-MM-DD HH:mm:ss"
) => {
  return dayjs(date).format(pattern);
};

export const dateFormatAgo = (date: Date | number | string) => {
  return dayjs(date).fromNow();
};

const target = "/api/imgs/upload";

export const onUploadImg = async (files: File[], callback: any) => {

  if('uploadImg' in window){
    // @ts-ignore
    window['uploadImg'](files,callback)
    return
  }
  
  const upload = async () => {
    const res = await Promise.all(
      files.map(async (f) => {
        const form = new FormData();
        form.append("file", f);
        return (await $fetch(target, {
          method: "POST",
          body: form,
        })) as any;
      })
    );
    callback(
      res.map((r) => ({
        url: `${r.data.uploadPath.replace(/http:/, 'https:')}`,
        alt: "alt",
        title: "title",
      }))
    );
  };
  toast.promise(upload, {
    loading: "上传中...请耐心等待..",
    success: () => {
      return "上传成功";
    },
    error: () => {
      return "上传失败";
    },
  });
};
