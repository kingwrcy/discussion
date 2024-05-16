import { z } from "zod";


export default defineEventHandler(async (event) => {
  const pid = getRouterParam(event, "pid");

  if (!pid) {
    throw createError("不存在的帖子");
  }

  const post = await prisma.post.findFirst({
    where: {
      pid: pid,
    },
    include: {
      author: true,
      tags: true,
      Comment: true,
    },
  });


  return {
    success: true,
    post,
  };
});
