import type { SysConfigDTO, TGMessage } from '~/types'

export default defineEventHandler(async (event) => {
  const request = await readBody(event) as TGMessage
  const token = getHeader(event, 'X-Telegram-Bot-Api-Secret-Token')
  const sysConfig = await prisma.sysConfig.findFirst()
  const sysConfigDTO = sysConfig?.content as unknown as SysConfigDTO
  if (token !== sysConfigDTO.notify.tgSecret) {
    return 'Unauthorized'
  }

  if (!sysConfigDTO.notify.tgBotEnabled || !sysConfigDTO.notify.tgBotToken) {
    return 'Telegram bot is not enabled'
  }

  const params = request.message.text
  const chatID = request.message.chat.id.toString()

  if (params.split('#').length !== 2) {
    sendTgMessage(sysConfigDTO, chatID, `格式不正确`)
    return
  }
  const [username, secretKey] = params.split('#')
  const user = await prisma.user.findUnique({
    where: { username, secretKey },
  })
  if (!user) {
    sendTgMessage(sysConfigDTO, chatID, `不存在${username}这个用户`)
    return
  }
  await prisma.user.update({
    where: { username, secretKey },
    data: { tgChatID: chatID },
  })
  sendTgMessage(sysConfigDTO, chatID, '恭喜你，操作成功,接下来有消息这里就会通知你！')

  return 'Hello Nitro'
})
