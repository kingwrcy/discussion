import { MessageType } from '@prisma/client'

export default defineEventHandler(async (event) => {
  const username = getRouterParam(event, 'username')

  if (!username) {
    throw createError('用户不存在')
  }

  const user = await prisma.user.findUnique({
    where: {
      username: decodeURIComponent(username),
    },
    include: {
      _count: {
        select: {
          fav: true,
          comments: true,
          posts: true,
          ReceiveMessage: {
            where: {
              type: {
                not: MessageType.PRIVATE_MSG,
              },
            },
          },
        },
      },
    },
  })

  const privateMsgCount = await prisma.message.count({
    where: {
      type: MessageType.PRIVATE_MSG,
      toUid: user?.uid,
    },
  })

  let unreadMessageCount = 0
  let unreadPrivateMessageCount = 0

  if (event.context.uid) {
    unreadMessageCount = await prisma.message.count({
      where: {
        type: { not: 'PRIVATE_MSG' },
        toUid: user?.uid,
        read: false,
      },
    })
    unreadPrivateMessageCount = await prisma.message.count({
      where: {
        type: MessageType.PRIVATE_MSG,
        toUid: user?.uid,
        read: false,
      },
    })
  }

  // @ts-expect-error 删除用户密码
  delete user?.password
  return { ...user, privateMsgCount, unreadMessageCount, unreadPrivateMessageCount }
})
