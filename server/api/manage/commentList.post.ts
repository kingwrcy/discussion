import { Prisma } from "@prisma/client";

type ListCommentRequest = {
  page: number;
  size: number;
  username?: string;
  pid?: string;
  begin?: Date;
  end?: Date;
};

export default defineEventHandler(async (event) => {
  const request = (await readBody(event)) as ListCommentRequest;
  const where: Prisma.CommentWhereInput = {};

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

  let comments = await prisma.comment.findMany({
    where,
    include: {
      author: {
        select: {
          uid: true,
          username: true,
          avatarUrl: true,
        },
      },
      post: true,
    },
    orderBy: {
      createdAt: "desc",
    },

    skip: (request.page - 1) * request.size,
    take: request.size,
  });
  const total = await prisma.comment.count({
    where,
  });

  return {
    success: true,
    comments,
    total,
  };
});
