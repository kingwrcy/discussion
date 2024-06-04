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
          ReceiveMessage: true,
        },
      },
    },
  })
  // @ts-expect-error 删除用户密码
  delete user?.password
  return user
})
