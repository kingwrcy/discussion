import { MessageType } from '@prisma/client'
import type { SysConfigDTO } from '~/types'

interface SendMsgRequest {
  content: string
  toUser: string
  token?: string
}

export default defineEventHandler(async (event) => {
  if (!event.context.uid) {
    throw createError('请先去登录')
  }
  const currentUser = await prisma.user.findUnique({ where: { uid: event.context.uid } })
  if (!currentUser) {
    return {
      success: false,
      message: '当前用户不存在',
    }
  }

  const request = await readBody(event) as SendMsgRequest
  if (!request.content || !request.toUser) {
    return {
      success: false,
      message: '内容和接收者不能为空',
    }
  }

  const sysConfig = await prisma.sysConfig.findFirst()
  const sysConfigDTO = sysConfig?.content as unknown as SysConfigDTO

  if (sysConfigDTO.googleRecaptcha && sysConfigDTO.googleRecaptcha.enable) {
    const { success, message } = await checkGoogleRecaptcha(sysConfigDTO.googleRecaptcha.secretKey, request.token)
    if (!success) {
      return {
        success: false,
        message,
      }
    }
  }

  const targetUser = await prisma.user.findUnique({ where: { username: request.toUser } })
  if (!targetUser) {
    return {
      success: false,
      message: '接收者不存在',
    }
  }
  if (currentUser.uid === targetUser.uid) {
    return {
      success: false,
      message: '不能给自己发送私信',
    }
  }
  await prisma.message.create({
    data: {
      content: request.content,
      fromUid: currentUser!.uid,
      toUid: targetUser.uid,
      read: false,
      type: MessageType.PRIVATE_MSG,
    },
  })
  sendTgMessage(sysConfigDTO, targetUser.tgChatID, `你收到了[${currentUser!.username}](${sysConfigDTO.websiteUrl}/member/${currentUser!.username})一条私信：\n\n${request.content}`)

  return {
    success: true,
    message: '发送成功',
  }
})
