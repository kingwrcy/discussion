export default defineEventHandler(async (event) => {
  if (!event.context.uid) {
    throw createError('请先去登录')
  }

  const formData = await readFormData(event)
  // https://openai.weixin.qq.com/weixinh5/webapp/h774yvzC2xlB4bIgGfX2stc4kvC85J/cos/upload
  // key : media
  const res = await $fetch('https://kf.dianping.com/api/file/singleImage', {
    method: 'POST',
    body: formData,
    headers: {
      'Referer': 'https://h5.dianping.com/',
      'User-Agent': ' Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36 Edg/121.0.0.0',
    },
  })
  return res
})
