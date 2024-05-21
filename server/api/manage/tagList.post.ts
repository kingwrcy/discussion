import { Prisma } from "@prisma/client";

type ListUserRequest = {
  page: number;
  size: number;
};

export default defineEventHandler(async (event) => {
  const request = (await readBody(event)) as ListUserRequest;

  if (request.page <= 0 && !request.page) {
    request.page = 1;
  }
  if (request.size <= 0 && !request.size) {
    request.size = 20;
  }

  let tags = await prisma.tag.findMany({
    include: {
      _count: {
        select: {
          posts: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    skip: (request.page - 1) * request.size,
    take: request.size,
  });
  const total = await prisma.user.count();

  return {
    success: true,
    tags,
    total,
  };
});
