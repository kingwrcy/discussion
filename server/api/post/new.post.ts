import { PointReason, UserStatus } from "@prisma/client";
import { z } from "zod";
import { SysConfigDTO, createPostSchema } from "~/types";

type createPostRequest = z.infer<typeof createPostSchema>;

export default defineEventHandler(async (event) => {
  if (!event.context.uid) {
    throw createError("请先去登录");
  }

  const request = (await readBody(event)) as createPostRequest;
  const validateResult = createPostSchema.safeParse(request);
  if (!validateResult.success) {
    return {
      success: false,
      message: validateResult.error.issues.map((e) => e.message).join(","),
    };
  }
  if (request.pid) {
    const post = await prisma.post.findUnique({
      where: { pid: request.pid },
    });
    if (!post) {
      throw createError("帖子不存在");
    }
    if (post.uid !== event.context.uid) {
      throw createError("无权修改该帖子");
    }
  }

  const user = await prisma.user.findUnique({
    where: { uid: event.context.uid },
  });
  if (!user || user.status === UserStatus.BANNED) {
    throw createError("用户不存在或已被封禁");
  }
  if (user.point <=0) {
    throw createError("用户积分小于或等于0分,不能发帖");
  }
  const pid = `p${randomId()}`;

  try {
    await prisma.post.upsert({
      where: {
        pid: request.pid ?? pid,
      },
      update: {
        title: request.title,
        content: request.content,
        tagId: request.tagId,
      },
      create: {
        pid,
        title: request.title,
        content: request.content,
        uid: event.context.uid,
        tagId: request.tagId,
      },
    });
    if (!request.pid) {
      await prisma.tag.update({
        where: {
          id: request.tagId,
        },
        data: {
          count: {
            increment: 1,
          },
        },
      });

      const sysConfig = await prisma.sysConfig.findFirst();
      const sysConfigDTO = sysConfig?.content as SysConfigDTO;
      let {
        _sum: { point: totalToday },
      } = await prisma.pointHistory.aggregate({
        _sum: {
          point: true,
        },
        where: {
          uid: event.context.uid,
          reason: PointReason.POST,
        },
      });
      totalToday = totalToday ?? 0;
      const limit = totalToday >= sysConfigDTO.pointPerPostByDay;

      await prisma.user.update({
        where: {
          uid: event.context.uid,
        },
        data: {
          postCount: {
            increment: 1,
          },
          point: {
            increment: limit ? 0 : sysConfigDTO.pointPerPost,
          },
        },
      });

      if (!limit) {
        await prisma.pointHistory.create({
          data: {
            uid: event.context.uid,
            pid: request.pid || pid,
            point: sysConfigDTO.pointPerPost,
            reason: PointReason.POST,
          },
        });
      }
    }
  } catch (e) {
    console.log("error", e);
    throw createError("发表贴子失败");
  }
  return {
    success: true,
    pid: request.pid || pid,
  };
});
