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

  const posts = await prisma.post.findMany({
    where,
    include: {      
      _count:{
        select:{
          comments:true
        }
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
