export default defineEventHandler(async (event) => {
  const pid = getRouterParam(event, "pid");
  const query = getQuery(event);
  let page = parseInt(query.page as string);
  if (isNaN(page)) {
    page = 1;
  }
  if (!pid) {
    throw createError("不存在的帖子");
  }

  const post = await prisma.post.findFirst({
    where: {
      pid: pid,
    },
    include: {
      author: true,
      tags: true,
      comments: {
        include: {
          author: true,
        },
        take: 20,
        skip: (page - 1) * 20,
        orderBy: {
          createdAt: "asc",
        },
      },
      _count: {
        select: {
          comments: true,
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

  return {
    success: true,
    post,
  };
});
