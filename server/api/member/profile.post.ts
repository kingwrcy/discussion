export default defineEventHandler(async (event) => {
  if (!event.context.uid) {
    return {}
  }

  const user = await prisma.user.findUnique({
    where: {
      uid: event.context.uid,
    },
    include: {
      _count: {
        select: {
          fav: true,
        },
      },
    },
  })

  const unRead = await prisma.message.count({
    where: {
      toUid: event.context.uid,
      read: false,
    },
  })
  // @ts-expect-error 删除用户密码
  delete user.password
  return {
    ...user,
    unRead,
  }
})
