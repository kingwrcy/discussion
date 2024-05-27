type req = {
  page: number;
  size: number;
  count?: boolean;
};

export default defineEventHandler(async (event) => {
  const pid = getRouterParam(event, "pid");
  const body = (await readBody(event)) as req;
  if (!pid) {
    throw createError("不存在的帖子");
  }

  const page = (body.page as number) || 1;
  const size = (body.size as number) || 20;
  const uid = event.context.uid;

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
    });
  }

  const post = await prisma.post.findFirst({
    where: {
      pid: pid,
    },
    include: {
      PostSupport: true,
      author: {
        select: {
          username: true,
          avatarUrl: true,
          uid: true,
          role: true,
        },
      },
      tag: true,
      comments: {
        include: {
          post:{
            select:{
              pid:true,
            }
          },
          author: {
            select: {
              uid: true,
              username: true,
              avatarUrl: true,
              role: true,
            },
          },
          likes: {
            where: {
              uid: uid,
            },
            select: {
              uid: true,
              cid: true,
            },
          },
          dislikes: {
            where: {
              uid: uid,
            },
            select: {
              uid: true,
              cid: true,
            },
          },
        },
        take: size,
        skip: (page - 1) * size,
        orderBy: {
          createdAt: "asc",
        },
      },
      fav: true,
      _count: {
        select: {
          comments: true,
          commentLike: true,
          commentDisLike: true,
          PostSupport: true,
        },
      },
    },
  });

  const res = {
    success: true,
    post: {
      ...post,
      support: uid ? post?.PostSupport.length! > 0 : false,
      fav: uid ? post?.fav.length! > 0 : false,
      comments: post?.comments.map((comment) => ({
        ...comment,
        like: uid ? comment.likes.length > 0 : false,
        dislike: uid ? comment.dislikes.length > 0 : false,
      })),
    },
  };

  return res;
});
