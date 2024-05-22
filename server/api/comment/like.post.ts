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
  const cid = (params.cid as string) || "";
  if (!cid) {
    throw createError("评论不存在");
  }

  let comment = await prisma.comment.findUnique({
    where: {
      cid,
    },
    include: {
      post: {
        select: {
          pid: true,
        },
      },
    },
  });

  if (!comment) {
    throw createError("帖子不存在");
  }

  const count = await prisma.like.count({
    where: {
      uid: user.uid,
      cid: comment.cid,
    },
  });

  await prisma.disLike.deleteMany({
    where: {
      uid: user.uid,
      pid: comment.post.pid,
      cid: comment.cid,
    },
  });

  if (count > 0) {
    await prisma.like.deleteMany({
      where: {
        uid: user.uid,
        pid: comment.post.pid,
        cid: comment.cid,
      },
    });
  } else {
    await prisma.like.create({
      data: {
        uid: user.uid,
        pid: comment.post.pid,
        cid: comment.cid,
      },
    });
  }

  const newComment = await prisma.comment.findUnique({
    where: {
      cid,
    },
    include: {
      _count: {
        select: {
          likes: true,
          dislikes: true,
        },
      },
    },
  });
  return {
    success: true,
    like: count <= 0,
    dislike: count > 0,
    likeCount: newComment!._count.likes,
    dislikeCount: newComment!._count.dislikes,
  };
});
