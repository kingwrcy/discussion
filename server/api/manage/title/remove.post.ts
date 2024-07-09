interface AssignTitleRequest {
  userId: number
  titleId: number
}

export default defineEventHandler(async (event) => {
  const request = (await readBody(event)) as AssignTitleRequest
  await prisma.userTitle.deleteMany({
    where: {
      userId: request.userId,
      titleId: request.titleId,
    },
  })
  return {
    success: true,
    message: '',
  }
})
