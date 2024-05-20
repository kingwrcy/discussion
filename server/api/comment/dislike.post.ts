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

  const comment = await prisma.comment.findUnique({
    where: {
      cid,
    },
    include:{
      post:{
        select:{
          id:true
        }
      }
    }
  });

  if (!comment) {
    throw createError("帖子不存在");
  }

  const count = await prisma.disLike.count({
    where: {
      userId: user.id,
      commentId: comment.id,
    },
  });

  await prisma.like.deleteMany({
    where:{
      userId: user.id,
      postId: comment.post.id,
      commentId: comment.id,
    }
  })

  if (count > 0) {
    await prisma.disLike.deleteMany({
      where:{
        userId: user.id,
        postId: comment.post.id,
        commentId: comment.id,
      }
    })
  } else {
    await prisma.disLike.create({
      data: {
        userId: user.id,
        postId: comment.post.id,
        commentId: comment.id,
      },
    });
  }
  return {
    success: true,
  };
});
