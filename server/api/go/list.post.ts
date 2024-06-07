import type { Prisma } from '@prisma/client'

export default defineEventHandler(async (event) => {
  const params = getQuery(event)
  const hot = (params.hot as string) || ''
  const name = (params.name as string) || ''

  const where: Prisma.TagWhereInput = {}
  if (hot === 'true') {
    where.hot = true
  }
  else if (hot === 'false') {
    where.hot = true
  }
  if (name) {
    where.enName = name
  }
  const tags = await prisma.tag.findMany({
    where,
  })
  return {
    success: true,
    tags,
  }
})
