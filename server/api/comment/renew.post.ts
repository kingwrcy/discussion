import { PointReason, UserStatus } from "@prisma/client";
import { SysConfigDTO } from "~/types";

type commentRequest = {
  content: string;
  cid: string;
  pid: string;
};

function extractMentions(text: string) {
  // 使用正则表达式匹配前后为空格或行首行尾的@用户
  const mentionPattern = /(^|\s)@\w+(\s|$)/g;
  const matches = text.match(mentionPattern);
  // 去除前后的空格
  const mentions = matches ? matches.map((mention) => mention.trim()) : [];
  return mentions;
}

export default defineEventHandler(async (event) => {
  if (!event.context.uid) {
    await sendRedirect(event, "/member/login");
  }
  const request = (await readBody(event)) as commentRequest;
  if (!request.content) {
    throw createError("评论内容不能为空");
  }

  const user = await prisma.user.findUnique({
    where: { uid: event.context.uid }
  });
  if (!user || user.status === UserStatus.BANNED) {
    throw createError("用户不存在或已被封禁");
  }
  if (user.point <= 0) {
    throw createError("用户积分小于或等于0分,不能回帖");
  }

  const post = await prisma.post.findUnique({
    where: { pid: request.pid },
    include: {
      author: {
        select: {
          uid: true
        }
      }
    }
  });
  if (!post) {
    throw createError("帖子不存在");
  }
  const {
    _max: { floor: maxFloor }
  } = await prisma.comment.aggregate({
    _max: {
      floor: true
    },
    where: {
      pid: request.pid
    }
  });

  // 更新评论内容
  await prisma.comment.update({
    where: { cid: request.cid },
    data: { content: request.content }
  });

  const sysConfig = await prisma.sysConfig.findFirst();
  const sysConfigDTO = sysConfig?.content as SysConfigDTO;
  let {
    _sum: { point: totalToday }
  } = await prisma.pointHistory.aggregate({
    _sum: {
      point: true
    },
    where: {
      uid: event.context.uid,
      reason: PointReason.COMMENT
    }
  });
  totalToday = totalToday ?? 0;
  const limit = totalToday >= sysConfigDTO.pointPerCommentByDay;

  await prisma.user.update({
    where: {
      uid: user.uid
    },
    data: {
      lastActive: new Date(),
      point: {
        increment: limit ? 0 : sysConfigDTO.pointPerComment
      }
    }
  });

  await prisma.post.update({
    where: {
      pid: request.pid
    },
    data: {
      lastCommentTime: new Date(),
      lastCommentUid: event.context.uid
    }
  });
  return { success: true };
});
