import type { PointReason } from '@prisma/client'

interface SendPouintRequest {
  reason: 'SEND' | 'PUNISH'
  amount: ''
  uid: ''
  remark: ''
}

export default defineEventHandler(async (event) => {
  const request = (await readBody(event)) as SendPouintRequest
  if (!request.reason || !request.amount || !request.uid) {
    return {
      success: false,
      message: '参数错误',
    }
  }
  const amount = request.reason === 'SEND' ? Number.parseInt(request.amount) : -Number.parseInt(request.amount)
  await prisma.pointHistory.create({
    data: {
      uid: request.uid,
      reason: request.reason as PointReason,
      point: amount,
      remark: request.remark,
    },
  })
  await prisma.user.update({
    where: {
      uid: request.uid,
    },
    data: {
      point: {
        increment: amount,
      },
    },
  })
  return {
    success: true,
    message: '积分操作成功',
  }
})
