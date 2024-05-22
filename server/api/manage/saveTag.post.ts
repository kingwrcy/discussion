import { Prisma } from "@prisma/client";

type SaveTagRequest = {
  id?: number;
  name: string;
  desc: string;
};

export default defineEventHandler(async (event) => {
  const request = (await readBody(event)) as SaveTagRequest;
  if (request.name.trim() && request.desc.trim()) {
    await prisma.tag.upsert({
      where: {
        id: request.id,
      },
      update: {
        name: request.name,
        desc: request.desc,
      },
      create: {
        name: request.name,
        desc: request.desc,
      },
    });
  }
  return {
    success: true,
  };
});
