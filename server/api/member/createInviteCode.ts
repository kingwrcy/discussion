import { PointReason } from '@prisma/client'
import type { SysConfigDTO } from '~/types'

export default defineEventHandler(async (event) => {
  if (!event.context.uid) {
    throw createError('请先去登录')
  }
  const sysConfig = await prisma.sysConfig.findFirst()
  const sysConfigDTO = sysConfig?.content as unknown as SysConfigDTO
  const point = sysConfigDTO.createInviteCodePoint

  const user = await prisma.user.findUnique({
    where: {
      uid: event.context.uid,
    },
    select: {
      role: true,
    },
  })

  const count = await prisma.user.count({
    where: {
      uid: event.context.uid,
      point: {
        gte: point,
      },
    },
  })
  if (count === 0) {
    return {
      success: false,
      message: `您的积分不足，无法生成邀请码`,
    }
  }

  await prisma.pointHistory.create({
    data: {
      uid: event.context.uid,
      point: user.role === 'ADMIN' ? 1 : point,
      reason: PointReason.INVITE,
    },
  })
  await prisma.user.update({
    where: { uid: event.context.uid },
    data: {
      point: {
        decrement: user.role === 'ADMIN' ? 1 : point,
      },
    },
  })
  const iCode = `i${randomId()}`
  await prisma.inviteCode.create({
    data: {
      fromUid: event.context.uid,
      createdAt: new Date(),
      endAt: new Date(new Date().getTime() + 24 * 60 * 60 * 1000),
      content: iCode,
      toUid: '',
    },
  })
  return {
    success: true,
    data: iCode,
    message: `邀请码生成成功！`,
  }
})
