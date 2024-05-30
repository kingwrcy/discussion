export default defineEventHandler(async (event) => {
  if (!event.context.uid) {
    throw createError("请先去登录");
  }

  const pid = getQuery(event).pid as string;

  if (!pid) {
    throw createError("帖子不存在");
  }

  const exist = await prisma.postSupport.count({
    where: { uid: event.context.uid, pid },
  });
  if (exist) {
    await prisma.postSupport.deleteMany({
      where: { uid: event.context.uid, pid },
    });
  } else {
    await prisma.postSupport.create({
      data: { uid: event.context.uid, pid },
    });
  }

  await prisma.user.update({
    where: { uid: event.context.uid },
    data: {
      lastActive: new Date(),
    },
  });
  return {
    success: true,
  };
});
