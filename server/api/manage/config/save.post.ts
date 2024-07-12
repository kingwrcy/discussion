import type { Prisma } from '@prisma/client'

export default defineEventHandler(async (event) => {
  const body = await readBody(event) as any as Prisma.JsonObject
  const config = await prisma.sysConfig.findFirst()
  await prisma.sysConfig.upsert({
    where: { id: config?.id },
    create: {
      content: body,
    },
    update: {
      content: body,
    },
  })

  return {
    success: true,
  }
})
