import { MessageType, PointReason } from "@prisma/client";
import { SysConfigDTO } from "~/types";

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

  if (user.point < 1) {
    throw createError("积分不够");
  }

  const comment = await prisma.comment.findUnique({
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
  const count = await prisma.disLike.count({
    where: {
      uid: user.uid,
      cid: comment.cid,
    },
  });

  const sysConfig = await prisma.sysConfig.findFirst();
  const sysConfigDTO = sysConfig?.content as SysConfigDTO;

  await prisma.pointHistory.create({
    data: {
      uid: user.uid,
      point: -sysConfigDTO.pointPerLikeOrDislike,
      cid,
      pid: comment.pid,
      reason: PointReason.DISLIKE,
    },
  });

  await prisma.user.update({
    where: {
      uid: user.uid,
    },
    data: {
      point: {
        decrement: sysConfigDTO.pointPerLikeOrDislike,
      },
    },
  });

  await prisma.like.deleteMany({
    where: {
      uid: user.uid,
      pid: comment.post.pid,
      cid: comment.cid,
    },
  });

  if (count > 0) {
    await prisma.disLike.deleteMany({
      where: {
        uid: user.uid,
        pid: comment.post.pid,
        cid: comment.cid,
      },
    });
  } else {
    await prisma.disLike.create({
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
      likes: true,
      dislikes: true,
      _count: {
        select: {
          likes: true,
          dislikes: true,
        },
      },
    },
  });

  await prisma.message.create({
    data: {
      content: `你的<a class='text-blue-500 mx-1' href='/post/${
        comment.post.pid
      }#${comment.floor}'>评论</a>被<a class='text-blue-500 mx-1' href='/member/${
        user.username
      }'>${user.username}</a>${count > 0 ? "取消" : ""}点踩了`,
      read: false,
      toUid: comment.uid,
      type: MessageType.DISLIKE,
      relationId: comment.post.pid,
    },
  });

  return {
    success: true,
    like: newComment?.likes.length! > 0,
    dislike: newComment?.dislikes.length! > 0,
    likeCount: newComment!._count.likes,
    dislikeCount: newComment!._count.dislikes,
  };
});
