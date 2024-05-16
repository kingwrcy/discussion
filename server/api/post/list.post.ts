import { Prisma } from "@prisma/client";

type ListPostRequest = {
  page: number;
  size: number;
  authorId?: number;
  tag?: string;
  query?: string;
};

type ThenArg<T> = T extends PromiseLike<infer U> ? U : T;
export type QueryPostResponse = ThenArg<ReturnType<typeof query>>;

export default defineEventHandler(async (event) => {
  const request = (await readBody(event)) as ListPostRequest;

  const where: Prisma.PostWhereInput = {};

  if (request.authorId) {
    where.authorId = request.authorId;
  }
  if (request.tag) {
    where.tags = {
      some: {
        name: request.tag,
      },
    };
  }

  const posts = await query(where, request);
  const total = await prisma.post.count({
    where,
  });

  return {
    success: true,
    posts,
    total,
  };
});

async function query(where: Prisma.PostWhereInput, request: ListPostRequest) {
  const posts = await prisma.post.findMany({
    where,
    include: {
      // author: {
      //   select: {
      //     avatarUrl: true,
      //     username: true,
      //   },
      // },
      // tags: {
      //   select: {
      //     name: true,
      //     id: true,
      //   },
      // },
    },
    orderBy: {
      createdAt: "desc",
    },
    skip: (request.page - 1) * request.size,
    take: request.size,
  });
  return posts;
}
