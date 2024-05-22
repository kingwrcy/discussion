import { Prisma } from "@prisma/client";

type ListPostRequest = {
  page: number;
  size: number;
  username?: string;
  pid?: string;
  begin?: Date;
  end?: Date;
};

export default defineEventHandler(async (event) => {
  const request = (await readBody(event)) as ListPostRequest;
  const where: Prisma.PostWhereInput = {};

  if (request.page <= 0 && !request.page) {
    request.page = 1;
  }
  if (request.size <= 0 && !request.size) {
    request.size = 20;
  }
  if (request.pid) {
    where.pid = request.pid;
  }
  if (request.username) {
    where.author = {
      username: request.username.trim(),
    };
  }
  if (request.begin) {
    where.createdAt = {
      gte: request.begin,
    };
  }
  if (request.end) {
    where.createdAt = {
      lte: request.end,
    };
  }

  let posts = await prisma.post.findMany({
    where,
    include: {
      author: {
        select: {
          uid: true,
          username: true,
          avatarUrl: true,
        },
      },
      _count: {
        select: {
          comments: true,
        },
      },
      tag: true,
    },
    orderBy: {
      createdAt: "desc",
    },

    skip: (request.page - 1) * request.size,
    take: request.size,
  });
  const total = await prisma.post.count({
    where,
  });

  return {
    success: true,
    posts,
    total,
  };
});
