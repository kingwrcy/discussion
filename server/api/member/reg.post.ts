import type { z } from 'zod'

import { default as bcrypt } from 'bcryptjs'
import { sha256 } from 'js-sha256'
import type { User } from '@prisma/client'
import { UserRole } from '@prisma/client'
import { regRequestSchema } from '~/types'
import type { SysConfigDTO } from '~/types'
import { checkGoogleRecaptcha } from '~/server/utils'

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
  let inviteUser: User | null = null

  if (sysConfigDTO.googleRecaptcha && sysConfigDTO.googleRecaptcha.enable) {
    const { success, message } = await checkGoogleRecaptcha(sysConfigDTO.googleRecaptcha.secretKey, request.token)
    if (!success) {
      return {
        success: false,
        message,
      }
    }
  }

  if (invite) {
    if (!request.inviteCode) {
      return {
        success: false,
        message: '当前已开启邀请码注册',
      }
    }
    inviteCodes = await prisma.inviteCode.findFirst({
      where: {
        content: request.inviteCode,
        toUid: null,
        endAt: {
          gte: new Date(),
        },
      },
    })

    if (!inviteCodes) {
      return {
        success: false,
        message: '邀请码已失效',
      }
    }
    inviteUser = await prisma.user.findFirst({
      where: {
        uid: inviteCodes?.fromUid,
      },
    })
    if (!inviteUser) {
      return {
        success: false,
        message: '邀请人不存在',
      }
    }
  }

  if (sysConfigDTO.regWithEmailCodeVerify && (!request.emailCode || !request.emailCodeKey)) {
    return {
      success: false,
      message: '请输入邮箱验证码',
    }
  }
  if (sysConfigDTO.regWithEmailCodeVerify) {
    const emailCode = await prisma.emailCode.findFirst({
      where: {
        key: request.emailCodeKey,
      },
    })
    if (!emailCode) {
      return {
        success: false,
        message: '邮箱验证码错误',
      }
    }
    if (emailCode.code.toUpperCase() !== request.emailCode?.toUpperCase()) {
      return {
        success: false,
        message: '邮箱验证码错误',
      }
    }
    if (emailCode.used) {
      return {
        success: false,
        message: '邮箱验证码已使用了',
      }
    }
    if (emailCode.validAt < new Date()) {
      return {
        success: false,
        message: '邮箱验证码已过期',
      }
    }
    await prisma.emailCode.update({
      where: {
        id: emailCode.id,
      },
      data: {
        used: true,
      },
    })
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
        invitedById: inviteUser ? inviteUser.id : null,
        secretKey: randomId(),
      },
    })
    if (invite && inviteCodes) {
      await prisma.inviteCode.update({
        where: { id: inviteCodes.id }, // 使用 inviteCode 的唯一标识符进行更新
        data: {
          toUid: uid,
        },
      })
    }
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
