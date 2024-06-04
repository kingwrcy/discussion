export default defineEventHandler(async (event) => {
  const cid = getRouterParam(event, 'cid')
  const userId = event.context.userId

  const comment = await prisma.comment.findUnique({
    where: {
      cid,
    },
    include: {
      author: {
        select: {
          username: true,
          avatarUrl: true,
        },
      },
      likes: {
        where: {
          userId: event.context.userId ?? undefined,
        },
        select: {
          userId: true,
        },
      },
      dislikes: {
        where: {
          userId: event.context.userId ?? undefined,
        },
        select: {
          userId: true,
        },
      },
      _count: {
        select: {
          dislikes: true,
          likes: true,
        },
      },
    },
  })
  return {
    success: true,
    comment: {
      ...comment,
      like: userId && comment?.likes ? comment?.likes.length > 0 : false,
      dislike:
        userId && comment?.dislikes ? comment?.dislikes.length > 0 : false,
    },
  }
})
