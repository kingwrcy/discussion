interface ToggleTagHotRequest {
  id: number
}

export default defineEventHandler(async (event) => {
  const request = (await readBody(event)) as ToggleTagHotRequest

  const tag = await prisma.tag.findUnique({
    where: {
      id: request.id,
    },
  })
  if (!tag) {
    throw createError('不存在的标签')
  }
  await prisma.tag.update({
    where: {
      id: request.id,
    },
    data: {
      hot: !tag.hot,
    },
  })
  return {
    success: true,
  }
})
