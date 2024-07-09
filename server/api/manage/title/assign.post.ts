interface AssignTitleRequest {
  uid: string
  title: string
}

export default defineEventHandler(async (event) => {
  const request = (await readBody(event)) as AssignTitleRequest
  const user = await prisma.user.findFirst({
    include: {
      _count: {
        select: {
          titles: true,
        },
      },
      titles: true,
    },
    where: {
      uid: request.uid,
    },
  })
  if (!user) {
    return {
      success: false,
      message: '用户不存在',
    }
  }
  const title = await prisma.title.findFirst({
    where: {
      title: request.title,
    },
  })
  if (!title) {
    return {
      success: false,
      message: '头衔不存在',
    }
  }
  if (title.status === false) {
    return {
      success: false,
      message: '头衔已经禁用了',
    }
  }
  if (user.titles.findIndex(t => t.id === title.id) >= 0) {
    return {
      success: false,
      message: '当前用户已经拥有这个头衔了',
    }
  }

  if (user._count.titles >= 2) {
    return {
      success: false,
      message: '用户头衔已经达到上限',
    }
  }

  try {
    await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        titles: {
          connect: [
            { id: title.id },
          ],
        },
      },
    })
  }
  catch (e) {
    return {
      success: false,
      message: '当前用户已经拥有这个头衔了',
    }
  }
  return {
    success: true,
    message: '',
  }
})
