type ListPostRequest = {
  page: number;
  size: number;
  username:string;
};

export default defineEventHandler(async (event) => {
  if (!event.context.uid) {
    throw createError("请先去登录");
  }

  const request = (await readBody(event)) as ListPostRequest;

  const user = await prisma.user.findUnique({
    where: { username:request.username },
  });
  if (!user) {
    throw createError("用户不存在");
  }

  if (request.page <= 0 && !request.page) {
    request.page = 1;
  }
  if (request.size <= 0 && !request.size) {
    request.size = 20;
  }

  let points = await prisma.pointHistory.findMany({
    where: { uid: user.uid },
    include: {
      post: {
        select: {
          pid: true,
          title: true,
        },
      },
      comment: {
        select: {
          cid: true,
          pid: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },

    skip: (request.page - 1) * request.size,
    take: request.size,
  });
  const total = await prisma.pointHistory.count({
    where: { uid: user.uid },
  });

  return {
    success: true,
    points,
    total,
  };
});
