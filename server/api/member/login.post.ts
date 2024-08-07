import { default as bcrypt } from 'bcryptjs'
import jwt from 'jsonwebtoken'
import type { z } from 'zod'
import { checkGoogleRecaptcha } from '~/server/utils'
import type { SysConfigDTO } from '~/types'
import { loginRequestSchema } from '~/types'

type regRequest = z.infer<typeof loginRequestSchema>

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const request = (await readBody(event)) as regRequest

  const validateResult = loginRequestSchema.safeParse(request)
  if (!validateResult.success) {
    return {
      success: false,
      message: validateResult.error.issues.map(e => e.message).join(','),
    }
  }

  const sysConfig = await prisma.sysConfig.findFirst()
  const sysConfigDTO = sysConfig?.content as unknown as SysConfigDTO
  if (sysConfigDTO.googleRecaptcha && sysConfigDTO.googleRecaptcha.enable) {
    const { success, message } = await checkGoogleRecaptcha(sysConfigDTO.googleRecaptcha.secretKey, request.token)
    if (!success) {
      return {
        success: false,
        message,
      }
    }
  }

  const user = await prisma.user.findFirst({
    where: { username: request.username },
  })
  if (!user) {
    return {
      success: false,
      message: '用户名/密码不正确',
    }
  }

  if (!bcrypt.compareSync(request.password, user.password)) {
    return {
      success: false,
      message: '用户名/密码不正确',
    }
  }

  const token = jwt.sign(
    {
      username: request.username,
      uid: user.uid,
      userId: user.id,
    },
    config.jwtSecretKey,
    {
      expiresIn: 60 * 60 * 24 * 10,
    },
  )

  await prisma.user.update({
    where: {
      uid: user.uid,
    },
    data: {
      lastLogin: new Date(),
    },
  })

  setCookie(event, config.public.tokenKey, token, {
    secure: config.public.cookieSecure,
    expires: new Date(Date.now() + 60 * 60 * 24 * 1000 * 10),
  })

  return { success: true, token, tokenKey: config.public.tokenKey }
})
