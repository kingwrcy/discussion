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
        take: size,
        skip: (page - 1) * size,
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
