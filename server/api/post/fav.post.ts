export default defineEventHandler(async (event) => {
  if (!event.context.uid) {
    throw createError("请先去登录");
  }

  const user = await prisma.user.findUnique({
    where: {
      uid: event.context.uid,
    },
  });
  if (!user) {
    throw createError("用户不存在");
  }

  const params = getQuery(event);
  const pid = (params.pid as string) || "";
  if (!pid) {
    throw createError("帖子不存在");
  }

  const post = await prisma.post.findUnique({
    where: {
      pid,
    },
  });

  if (!post) {
    throw createError("帖子不存在");
  }

  const count = await prisma.fav.count({
    where: {
      userId: user.id,
      postId: post.id,
    },
  });

  if (count > 0) {
    await prisma.fav.deleteMany({
      where: { userId: user.id, postId: post.id },
    });
  } else {
    await prisma.fav.create({
      data: {
        userId: user.id,
        postId: post.id,
      },
    });
  }
  return {
    success: true,
  };
});
