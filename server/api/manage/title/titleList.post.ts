import type { Prisma } from '@prisma/client'

interface ListTitleRequest {
  onlyEnabled?: boolean
}

export default defineEventHandler(async (event) => {
  const request = (await readBody(event)) as ListTitleRequest

  const condition = {} as Prisma.TitleFindManyArgs
  if (request.onlyEnabled) {
    condition.where = {
      status: true,
    }
  }
  const result = await prisma.title.findMany(condition)
  return {
    success: true,
    titles: result,
  }
})
