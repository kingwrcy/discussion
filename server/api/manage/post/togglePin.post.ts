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
  await prisma.post.update({
    where: { pid },
    data: {
      pinned: !post.pinned,
    },
  })
  return {
    success: true,
  }
})
