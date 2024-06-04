import type { Prisma } from '@prisma/client'

interface ListCommentRequest {
  page: number
  size: number
  username: string
}

export default defineEventHandler(async (event) => {
  const request = (await readBody(event)) as ListCommentRequest

  const where: Prisma.CommentWhereInput = {}
  const user = await prisma.user.findUnique({
    where: { username: request.username },
  })
  if (!user) {
    throw createError('用户不存在')
  }

  if (request.page <= 0 && !request.page) {
    request.page = 1
  }
  if (request.size <= 0 && !request.size) {
    request.size = 20
  }
  where.uid = user.uid

  const comments = await prisma.comment.findMany({
    where,
    include: {
      post: {
        select: {
          pid: true,
          title: true,
          createdAt: true,
          author: {
            select: {
              uid: true,
              avatarUrl: true,
              username: true,
            },
          },
        },
      },
      author: {
        select: {
          uid: true,
          avatarUrl: true,
          username: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
    skip: (request.page - 1) * request.size,
    take: request.size,
  })
  const total = await prisma.comment.count({
    where,
  })

  return {
    success: true,
    comments,
    total,
  }
})
