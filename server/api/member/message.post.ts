export default defineEventHandler(async (event) => {
  if (!event.context.uid) {
    throw createError("请先去登录");
  }

  const messages = await prisma.message.findMany({
    where: {
      toUid: event.context.uid,
    },
    include:{
      from:{
        select:{
          uid:true,
          username:true,
        }
      },
      to:{
        select:{
          uid:true,
          username:true,
        }
      }
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  console.log(messages)

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
