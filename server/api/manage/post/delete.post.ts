export default defineEventHandler(async (event) => {
  const params = getQuery(event)
  const pid = (params.pid as string) || ''
  if (!pid) {
    throw createError('帖子不存在')
  }

  const post = await prisma.post.findUnique({
    where: { pid },
  })
  if (!post) {
    throw createError('帖子不存在')
  }

  await prisma.like.deleteMany({
    where: {
      pid,
    },
  })
  await prisma.disLike.deleteMany({
    where: {
      pid,
    },
  })
  await prisma.comment.deleteMany({
    where: {
      pid,
    },
  })

  await prisma.post.delete({ where: { pid } })
  await prisma.user.update({
    where: {
      uid: post.uid,
    },
    data: {
      postCount: {
        decrement: 1,
      },
    },
  })
  return {
    success: true,
  }
})
