export default defineEventHandler(async (event) => {
  const params = getQuery(event);
  const cid = (params.cid as string) || "";
  if (!cid) {
    throw createError("评论不存在");
  }

  const comment = await prisma.comment.findUnique({
    where: {
      cid,
    },
  });
  if (!comment) {
    throw createError("评论不存在");
  }

  await prisma.like.deleteMany({
    where: {
      pid: comment.pid,
      cid,
    },
  });
  await prisma.disLike.deleteMany({
    where: {
      pid: comment.pid,
      cid,
    },
  });
  await prisma.comment.deleteMany({
    where: {
      cid,
    },
  });

  await prisma.user.update({
    where: {
      uid: comment.uid,
    },
    data: {
      commentCount: {
        decrement: 1,
      },
    },
  });

  return {
    success: true,
  };
});
