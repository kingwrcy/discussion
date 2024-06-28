import type { z } from 'zod'

import { default as bcrypt } from 'bcryptjs'
import { sha256 } from 'js-sha256'
import { UserRole } from '@prisma/client'
import { regRequestSchema } from '~/types'
import type { SysConfigDTO } from '~/types'

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
  const sysConfig = await prisma.sysConfig.findFirst()
  const sysConfigDTO = sysConfig?.content as unknown as SysConfigDTO
  const invite = sysConfigDTO.invite
  const uid = `u${randomId()}`
  let inviteCodes: any = {}

  if (invite) {
    if (!request.inviteCode) {
      return {
        success: false,
        message: '当前已开启注册限制',
      }
    }
    inviteCodes = await prisma.inviteCode.findFirst({
      where: {
        content: request.inviteCode,
        toUid: '',
        endAt: {
          gte: new Date(),
        },
      },
    })
    console.log(44, inviteCodes)

    if (!inviteCodes) {
      return {
        success: false,
        message: '邀请码已失效',
      }
    }
  }

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
    await prisma.inviteCode.update({
      where: { id: inviteCodes.id }, // 使用 inviteCode 的唯一标识符进行更新
      data: {
        toUid: uid,
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
