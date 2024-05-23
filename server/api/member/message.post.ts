type ListMessageRequest = {
  page: number;
  size: number;
};

export default defineEventHandler(async (event) => {
  if (!event.context.uid) {
    throw createError("请先去登录");
  }
  const request = (await readBody(event)) as ListMessageRequest;

  const messages = await prisma.message.findMany({
    where: {
      toUid: event.context.uid,
    },
    include: {
      from: {
        select: {
          uid: true,
          username: true,
        },
      },
      to: {
        select: {
          uid: true,
          username: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    skip: (request.page - 1) * request.size,
    take: request.size,
  });

  const total = await prisma.message.count({
    where: {
      toUid: event.context.uid,
    },
  });
  return {
    success: true,
    messages,
    total,
  };
});
