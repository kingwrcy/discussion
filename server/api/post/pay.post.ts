import { PointReason } from '@prisma/client'

interface CustomPost {
  hideContent: string
  uid: string
  payPoint: number
  payUser: {
    uid: string
  }[]
}

export default defineEventHandler(async (event) => {
  if (!event.context.uid) {
    throw createError('请先去登录')
  }
  const request = await readBody(event)
  const user = await prisma.user.findUnique({
    where: {
      uid: event.context.uid,
    },
  })
  if (!user) {
    throw createError('用户不存在')
  }
  const post = await prisma.post.findUnique({
    where: {
      pid: request.pid,
    },
    select: {
      hideContent: true,
      payPoint: true,
      uid: true,
      payUser: {
        select: {
          uid: true,
        },
      },
    },
  }) as unknown as CustomPost

  if (post.payUser.some(user => user.uid === event.context.uid) || post.uid === event.context.uid) {
    return {
      success: true,
      content: post.hideContent,
    }
  }
  if (user.point < (post?.payPoint ?? 0)) {
    return {
      success: false,
      content: '积分不够',
    }
  }
  await prisma.user.update({
    where: {
      uid: event.context.uid,
    },
    data: {
      lastActive: new Date(),
      point: {
        decrement: post?.payPoint,
      },
    },
  })
  await prisma.user.update({
    where: {
      uid: post?.uid,
    },
    data: {
      lastActive: new Date(),
      point: {
        increment: post?.payPoint,
      },
    },
  })

  await prisma.pointHistory.create({
    data: {
      uid: event.context.uid,
      point: -post?.payPoint ?? 0,
      pid: request.pid,
      reason: PointReason.PUTIN,
    },
  })
  await prisma.pointHistory.create({
    data: {
      uid: post?.uid,
      point: post?.payPoint ?? 0,
      pid: request.pid,
      reason: PointReason.INCOME,
    },
  })
  await prisma.pay.create({
    data: {
      createdAt: new Date(),
      point: post.payPoint,
      uid: event.context.uid,
      pid: request.pid,
    },
  })

  return {
    success: true,
    content: post.hideContent,
  }
})
