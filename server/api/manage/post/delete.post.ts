export default defineEventHandler(async (event) => {
  const params = getQuery(event);
  const pid = (params.pid as string) || "";
  if (!pid) {
    throw createError("帖子不存在");
  }

  await prisma.like.deleteMany({
    where: {
      pid
    },
  });
  await prisma.comment.deleteMany({
    where: {
      pid
    },
  });

  await prisma.post.delete({ where: { pid } });
  return {
    success: true,
  };
});
