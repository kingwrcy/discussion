export default defineEventHandler(async (event) => {
  if (!event.context.uid) {
    throw createError('请先去登录')
  }
  const list = await prisma.inviteCode.findMany({
    where: {
      fromUid: event.context.uid,
    },
    include: {
      toUser: {
        select: {
          username: true,
          uid: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  })
  const total = await prisma.inviteCode.count({
    where: {
      fromUid: event.context.uid,
    },
  })
  return {
    success: true,
    list,
    total,
  }
})
