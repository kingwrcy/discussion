import type { Prisma } from '@prisma/client'

interface ListUserRequest {
  page: number
  size: number
  username?: string
  begin?: Date
  end?: Date
}

export default defineEventHandler(async (event) => {
  const request = (await readBody(event)) as ListUserRequest
  const where: Prisma.UserWhereInput = {}

  if (request.page <= 0 && !request.page) {
    request.page = 1
  }
  if (request.size <= 0 && !request.size) {
    request.size = 20
  }
  if (request.username) {
    where.username = request.username.trim()
  }
  if (request.begin) {
    where.createdAt = {
      gte: request.begin,
    }
  }
  if (request.end) {
    where.createdAt = {
      lte: request.end,
    }
  }

  const users = await prisma.user.findMany({
    where,
    include: {
      _count: {
        select: {
          comments: true,
          posts: true,
        },
      },
      titles: true,
    },
    orderBy: {
      createdAt: 'desc',
    },

    skip: (request.page - 1) * request.size,
    take: request.size,
  })
  const total = await prisma.user.count({
    where,
  })

  return {
    success: true,
    users,
    total,
  }
})
