interface reqestParams {
  fromUsername: string
}

export default defineEventHandler(async (event) => {
  const request = await readBody(event) as reqestParams
  if (!event.context.uid) {
    return {
      success: false,
      message: '请先去登录',
      list: [],
    }
  }

  const user = await prisma.user.findUnique({
    where: {
      username: request.fromUsername,
    },
  })
  if (!user) {
    return {
      success: false,
      message: '用户不存在',
      list: [],
    }
  }
  const result = await prisma.message.findMany({
    where: {
      OR: [
        {
          fromUid: event.context.uid,
          toUid: user.uid,

        },
        {
          fromUid: user.uid,
          toUid: event.context.uid,
        },
      ],
    },
    include: {
      from: {
        select: {
          uid: true,
          username: true,
          avatarUrl: true,
          headImg: true,
        },
      },
      to: {
        select: {
          uid: true,
          username: true,
          avatarUrl: true,
          headImg: true,
        },

      },
    },
    orderBy: {
      createdAt: 'asc',
    },
    take: 50,
  })

  await prisma.message.updateMany({
    where: {
      fromUid: user.uid,
      toUid: event.context.uid,
      read: false,
    },
    data: {
      read: true,
    },
  })
  return {
    success: true,
    message: '',
    list: result,
  }
})
