import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

import zhCn from "dayjs/locale/zh-cn";
import { toast } from "vue-sonner";

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

const target = "https://i.111666.best";

export const onUploadImg = async (files: File[], callback: any) => {
  const upload = async () => {
    const res = await Promise.all(
      files.map(async (f) => {
        const form = new FormData();
        form.append("image", f);
        const headers = {
          "Auth-Token": "UrQsI696geWByeif6s34dFkmiTYrCV4dpMIk1qZlPYoPr8AfuQ",
        };

        return (await $fetch(`${target}/image`, {
          method: "POST",
          body: form,
          headers,
        })) as { ok: boolean; src: string };
      })
    );
    callback(
      res.map((r) => ({
        url: `${target}${r.src}`,
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
