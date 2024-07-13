interface ListPostRequest {
  page: number
  size: number
}

export default defineEventHandler(async (event) => {
  const request = (await readBody(event)) as ListPostRequest
  if (!event.context.uid) {
    return {
      success: false,
      message: '请先去登录',
      list: [],
      total: 0,
    }
  }

  const lastMessagesIds = await prisma.$queryRaw`
  SELECT m1."id"
  FROM "Message" m1
  INNER JOIN (
    SELECT "fromUid", MAX("createdAt") as latest
    FROM "Message" WHERE type = 'PRIVATE_MSG' AND "toUid" = ${event.context.uid}
    GROUP BY "fromUid"
  ) m2 ON m1."fromUid" = m2."fromUid" AND m1."createdAt" = m2."latest"
  ORDER BY m1."createdAt" DESC
  LIMIT ${request.size} OFFSET ${(request.page - 1) * request.size}
` as any

  const result = await prisma.message.findMany({
    include: {
      from: true,
    },
    where: {
      id: {
        in: lastMessagesIds.map((item: any) => item.id),
      },
    },
    orderBy: {
      createdAt: 'desc',
    },

  })

  const totalRecords = await prisma.message.groupBy({
    by: ['fromUid'],
    where: {
      type: 'PRIVATE_MSG',
      toUid: event.context.uid,
    },
  })

  return {
    success: true,
    list: result,
    total: totalRecords.length,

  }
})
