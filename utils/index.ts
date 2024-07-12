import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime.js'

import zhCn from 'dayjs/locale/zh-cn.js'
import { toast } from 'vue-sonner'

dayjs.extend(relativeTime).locale(zhCn)

export function getAvatarUrl(hash: string, url: string | undefined | null) {
  if (url)
    return url
  const config = useRuntimeConfig()
  return `${config.public.avatarCdn}${hash}?d=identicon`
}

export function dateFormat(date: Date | number | string, pattern: string = 'YYYY-MM-DD HH:mm:ss') {
  return dayjs(date).format(pattern)
}

export function dateFormatAgo(date: Date | number | string) {
  return dayjs(date).fromNow()
}

const target = '/api/imgs/upload2wx'

export async function onUploadImg(files: File[], callback: any) {
  let upload = async () => {
    const res = await Promise.all(
      files.map(async (f) => {
        const form = new FormData()
        form.append('media', f)
        return (await $fetch(target, {
          method: 'POST',
          body: form,
        })) as any
      }),
    )
    callback(
      res.map(r => ({
        url: `${r.url}`,
        alt: 'alt',
        title: 'title',
      })),
    )
  }
  if ('uploadImg' in window) {
    // @ts-expect-error 自定义上传图片函数
    upload = window.uploadImg
  }

  toast.promise(upload, {
    loading: '上传中...请耐心等待..',
    success: () => {
      return '上传成功'
    },
    error: () => {
      return '上传失败'
    },
  })
}

export const getLength = function (str: string) {
  /// <summary>获得字符串实际长度，中文2，英文1</summary>
  /// <param name="str">要获得长度的字符串</param>
  let realLength = 0
  const len = str.length
  let charCode = -1
  for (let i = 0; i < len; i++) {
    charCode = str.charCodeAt(i)
    if (charCode >= 0 && charCode <= 128)
      realLength += 1
    else realLength += 2
  }
  return realLength
}
