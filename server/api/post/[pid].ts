interface req {
  page: number
  size: number
  count?: boolean
}

export default defineEventHandler(async (event) => {
  const pid = getRouterParam(event, 'pid')
  const body = (await readBody(event)) as req
  if (!pid) {
    throw createError('不存在的帖子')
  }

  const page = (body.page as number) || 1
  const size = (body.size as number) || 20
  const uid = event.context.uid

  // 查询当前uid的level
  const { level, role, id }: any = await prisma.user.findFirst({
    where: {
      uid,
    },
    select: {
      level: true,
      role: true,
      id: true,
    },
  })
  const { readRole, uid: postUid }: any = await prisma.post.findFirst({
    where: {
      pid,
    },
    select: {
      readRole: true,
      uid: true,
    },
  })

  if (!uid && readRole > 0) {
    return {
      success: false,
      message: '本帖需要注册用户才能查看',
    }
  }

  let canContinue = false
  // 如果用户是 ADMIN，跳过所有检查
  if (role === 'ADMIN') {
    canContinue = true
  }
  // 如果用户是 USER，检查 uid 是否匹配
  if (!canContinue && role === 'USER') {
    if (uid === postUid) {
      canContinue = true
    }
  }
  // 检查用户的 level 是否大于等于帖子的 readRole
  if (!canContinue && level >= readRole) {
    canContinue = true
  }

  if (!canContinue) {
    return {
      success: false,
      message: `查看本帖需要Lv${readRole}，您的权限不足`,
    }
  }

  if (body.count) {
    await prisma.post.update({
      where: {
        pid,
      },
      data: {
        viewCount: {
          increment: 1,
        },
      },
    })
  }

  const post = await prisma.post.findFirst({
    where: {
      pid,
    },
    include: {

      lastCommentUser: {
        select: {
          uid: true,
          username: true,
        },
      },
      PostSupport: true,
      author: {
        select: {
          titles: true,
          username: true,
          avatarUrl: true,
          headImg: true,
          uid: true,
          role: true,
          signature: true,
        },
      },
      tag: true,
      comments: {
        select: {
          id: false,
          createdAt: true,
          floor: true,
          content: true,
          pid: true,
          uid: true,
          cid: true,
          updatedAt: true,
          mentioned: true,
          post: {
            select: {
              pid: true,
              uid: true,
            },
          },
          author: {
            select: {
              uid: true,
              username: true,
              avatarUrl: true,
              headImg: true,
              role: true,
              signature: true,
              titles: true,
            },
          },
          likes: {
            where: {
              uid,
            },
            select: {
              uid: true,
              cid: true,
            },
          },
          dislikes: {
            where: {
              uid,
            },
            select: {
              uid: true,
              cid: true,
            },
          },
          _count: {
            select: {
              likes: true,
              dislikes: true,
            },
          },
        },
        take: size,
        skip: (page - 1) * size,
        orderBy: {
          createdAt: 'asc',
        },
      },
      fav: true,
      _count: {
        select: {
          comments: true,
          PostSupport: true,
        },
      },
    },
  })

  let fav = false
  if (uid) {
    const existsFav = await prisma.fav.findFirst({
      where: {
        userId: id,
        pid,
      },
    })
    if (existsFav) {
      fav = true
    }
    const unReadCount = await prisma.message.count({
      where: {
        toUid: uid,
        read: false,
        relationId: pid,
      },
    })
    if (unReadCount > 0) {
      await prisma.message.updateMany({
        where: {
          toUid: uid,
          read: false,
          relationId: pid,
        },
        data: {
          read: true,
        },
      })
    }
  }

  const res = {
    success: true,
    post: {
      ...post,
      support: uid ? post!.PostSupport.length! > 0 : false,
      fav,
      comments: post?.comments.map(comment => ({
        ...comment,
        like: uid ? comment.likes.length > 0 : false,
        dislike: uid ? comment.dislikes.length > 0 : false,
        likeCount: comment._count.likes,
        dislikeCount: comment._count.dislikes,
      })),
    },
  }

  return res
})
