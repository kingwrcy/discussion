export default defineEventHandler(async (event) => {
  if (!event.context.uid) {
    throw createError('请先登录')
  }
  const params = await getQuery(event)
  const messageId = Number.parseInt((params.messageId as string)) || 0
  if (messageId > 0) {
    await prisma.message.update({
      where: { id: messageId, toUid: event.context.uid },
      data: {
        read: true,
      },
    })
  }
  else {
    await prisma.message.updateMany({
      where: { toUid: event.context.uid },
      data: {
        read: true,
      },
    })
  }
  return {
    success: true,
    message: '操作成功',
  }
})
