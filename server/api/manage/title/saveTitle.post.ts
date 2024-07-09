interface SaveTitleRequest {
  style?: string
  title: string
  status: boolean
  id?: number
}

export default defineEventHandler(async (event) => {
  const request = (await readBody(event)) as SaveTitleRequest

  try {
    await prisma.title.upsert({
      create: {
        style: request.style || '',
        title: request.title,
        status: request.status,
      },
      where: {
        id: request.id,
      },
      update: {
        style: request.style || '',
        title: request.title,
        status: request.status,
      },
    })
  }
  catch (e) {
    return {
      success: false,
      message: '头衔已经存在了',
    }
  }
  return {
    success: true,
  }
})
