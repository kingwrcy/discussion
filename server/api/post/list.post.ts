import type { Prisma } from '@prisma/client'

interface ListPostRequest {
  page: number
  size: number
  uid?: string
  tag?: string
  query?: string
  key?: string
}

export default defineEventHandler(async (event) => {
  const request = (await readBody(event)) as ListPostRequest

  const where: Prisma.PostWhereInput = {}
  const uid = event.context.uid

  if (request.page <= 0 || !request.page) {
    request.page = 1
  }
  if (request.size <= 0 || !request.size) {
    request.size = 20
  }
  if (request.uid) {
    where.uid = request.uid
  }
  if (request.tag) {
    where.tag = {
      enName: request.tag,
    }
  }

  const include = {
    _count: {
      select: {
        comments: true,
      },
    },
    author: {
      select: {
        uid: true,
        avatarUrl: true,
        headImg: true,
        username: true,
        role: true,
      },
    },
    tag: true,
    comments: false,
    fav: true,
    lastCommentUser: true,
  }

  const pinnedPost = await prisma.post.findMany({
    where: { ...where, pinned: true },
    include,
    orderBy: [
      {
        pinned: 'desc',
      },
      {
        createdAt: 'desc',
      },
    ],
  })
  let posts = await prisma.post.findMany({
    where: { ...where, pinned: false, readRole: {
      not: 999,
    }, OR: [
      {
        title: {
          mode: 'insensitive',
          contains: request.key || '',
        },
      },
    ] },
    include,
    orderBy: {
      point: 'desc',
    },
    skip: (request.page - 1) * request.size,
    take: request.size,
  })

  posts = [...pinnedPost, ...posts]
  const total = await prisma.post.count({
    where: { ...where, readRole: {
      not: 999,
    }, OR: [
      {
        title: {
          mode: 'insensitive',
          contains: request.key || '',
        },
      },
    ] },
  })

  const postsWithExtraInfo = posts.map((post) => {
    return {
      ...post,
      fav: !!(uid && post.fav && post.fav.length > 0),
    }
  })

  return {
    success: true,
    posts: postsWithExtraInfo,
    total,
  }
})
