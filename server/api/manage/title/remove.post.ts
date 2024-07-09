interface AssignTitleRequest {
  userId: number
  titleId: number
}

export default defineEventHandler(async (event) => {
  const request = (await readBody(event)) as AssignTitleRequest
  await prisma.user.update({
    where: {
      id: request.userId,
    },
    data: {
      titles: {
        disconnect: {
          id: request.titleId,
        },
      },
    },
  })
  return {
    success: true,
    message: '',
  }
})
