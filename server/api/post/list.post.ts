import { Prisma } from "@prisma/client";

type ListPostRequest = {
  page: number;
  size: number;
  uid?: string;
  tag?: string;
  query?: string;
};

export default defineEventHandler(async (event) => {
  const request = (await readBody(event)) as ListPostRequest;

  const where: Prisma.PostWhereInput = {};
  const userId = event.context.userId

  if (request.page <= 0 && !request.page) {
    request.page = 1;
  }
  if (request.size <= 0 && !request.size) {
    request.size = 20;
  }
  if (request.uid) {
    where.uid = request.uid;
  }
  if (request.tag) {
    where.tags = {
      some: {
        name: request.tag,
      },
    };
  }

  let posts = await prisma.post.findMany({
    where,
    include: {
      _count: {
        select: {
          comments: true,
        },
      },
      author: {
        select: {
          uid: true,
          avatarUrl: true,
          username: true,
        },
      },
      tags: true,
      comments: false,
      fav: {
        where: {
          userId: userId,
        },
        select: {
          userId: true,
          postId: true,
        },
      },
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

  const postsWithExtraInfo = posts.map((post) => {
    return {
      ...post,
      fav: userId && post.fav && post.fav.length >0 ? true : false,
    };
  });

  return {
    success: true,
    posts: postsWithExtraInfo,
    total,
  };
});
