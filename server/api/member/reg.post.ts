import type { z } from 'zod'

import { default as bcrypt } from 'bcryptjs'
import { sha256 } from 'js-sha256'
import { UserRole } from '@prisma/client'
import { regRequestSchema } from '~/types'

type regRequest = z.infer<typeof regRequestSchema>

export default defineEventHandler(async (event) => {
  const request = (await readBody(event)) as regRequest
  const validateResult = regRequestSchema.safeParse(request)
  if (!validateResult.success) {
    return {
      success: false,
      message: validateResult.error.issues.map(e => e.message).join(','),
    }
  }

  const count = await prisma.user.count({
    where: { OR: [{ username: request.username }, { email: request.email }] },
  })
  if (count > 0) {
    return {
      success: false,
      message: '用户名/邮箱已经存在了',
    }
  }
  const uid = `u${randomId()}`
  const exist = await prisma.user.count({})
  try {
    await prisma.user.create({
      data: {
        uid,
        username: request.username,
        password: bcrypt.hashSync(request.password, 10),
        email: request.email.trim(),
        avatarUrl: sha256(request.email.trim()),
        role: exist ? UserRole.USER : UserRole.ADMIN,
        point: 100,
      },
    })
  }
  catch (e) {
    console.log('uid', uid, e)
    return {
      success: false,
      message: '用户名/邮箱已经存在了',
    }
  }

  return { success: true }
})
