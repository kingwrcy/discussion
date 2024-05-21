type req = {
  page: number;
  size: number;
};

export default defineEventHandler(async (event) => {
  const pid = getRouterParam(event, "pid");
  const body = (await readBody(event)) as req;
  if (!pid) {
    throw createError("不存在的帖子");
  }

  const page = (body.page as number) || 1;
  const size = (body.size as number) || 20;
  const userId = event.context.userId;

  const post = await prisma.post.findFirst({
    where: {
      pid: pid,
    },
    include: {
      author: {
        select: {
          username: true,
          avatarUrl: true,
          uid:true
        },
      },
      tags: true,
      comments: {
        include: {
          author: {
            select: {
              username: true,
              avatarUrl: true,
            },
          },
          likes: {
            where: {
              userId: userId,
            },
            select: {
              userId: true,
              commentId: true,
            },
          },
          dislikes: {
            where: {
              userId: userId,
            },
            select: {
              userId: true,
              commentId: true,
            },
          },
        },
        take: size,
        skip: (page - 1) * size,
        orderBy: {
          createdAt: "asc",
        },
      },
      fav: {
       
        select: {
          userId: true,
        },
      },
      _count: {
        select: {
          comments: true,
          commentLike: true,
          commentDisLike: true,
        },
      },
    },
  });
  await prisma.post.update({
    where: {
      pid,
    },
    data: {
      viewCount: {
        increment: 1,
      },
    },
  });

  const res = {
    success: true,
    post: {
      ...post,
      fav: userId ? post?.fav.length!>0  : false,
      comments: post?.comments.map((comment) => ({
        ...comment,
        like: userId ? comment.likes.length > 0 : false,
        dislike: userId ? comment.dislikes.length > 0 : false,
      })),
    },
  };

  return res;
});
