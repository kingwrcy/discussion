import { z } from "zod";
import { createPostSchema } from "~/types";

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

  const tags = request.tags.map((x) => {
    return { id: x };
  });

  const pid = `p${randomId()}`;


  try {
    await prisma.post.create({
      data: {
        pid,
        title: request.title,
        content: request.content,
        author: {
          connect: {
            uid: event.context.uid,
          },
        },
        tags: {
          connect: tags,
        },
      },
    });
    await prisma.tag.updateMany({
      where: {
        id: {
          in: request.tags,
        },
      },
      data: {
        count: {
          increment: 1,
        },
      },
    });
    await prisma.user.update({
      where: {
        uid: event.context.uid,
      },
      data: {
        postCount: {
          increment: 1,
        },
      },
    });
  } catch (e) {
    console.log("error", e);
    throw createError("发表贴子失败");
  }
  return {
    success: true,
    pid,
  };
});
