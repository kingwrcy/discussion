import fs from 'node:fs'

export default defineEventHandler((event) => {
  const config = useRuntimeConfig()

  const filename = getRouterParam(event, 'filename')
  return sendStream(event, fs.createReadStream(`${config.uploadDir}/${filename}`))
})
