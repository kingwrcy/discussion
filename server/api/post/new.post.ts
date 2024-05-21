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
  if(request.pid){
    const post = await prisma.post.findUnique({
      where:{pid:request.pid}
    })
    if(!post){
      throw createError("帖子不存在")
    }
    if(post.uid !== event.context.uid){
      throw createError("无权修改该帖子")
    }
  }

  const tags = request.tags.filter(x=>x>0).map((x) => {
    return { id: x };
  });


  const pid = `p${randomId()}`;

  try {
    await prisma.post.upsert({
      where: {
        pid: request.pid??pid,
      },
      update: {
        title: request.title,
        content: request.content,
        tags: {
          set: tags,
        },
      },
      create: {
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
    if (!request.pid) {
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
    }
  } catch (e) {
    console.log("error", e);
    throw createError("发表贴子失败");
  }
  return {
    success: true,
    pid:request.pid || pid,
  };
});
