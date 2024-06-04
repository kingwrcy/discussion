import { UserStatus } from '@prisma/client'

interface BanUserRequest {
  uid?: string
}

export default defineEventHandler(async (event) => {
  const request = (await readBody(event)) as BanUserRequest
  await prisma.user.update({
    where: {
      uid: request.uid,
    },
    data: {
      status: UserStatus.NORMAL,
      bannedEnd: null,
    },
  })
  return {
    success: true,
  }
})
