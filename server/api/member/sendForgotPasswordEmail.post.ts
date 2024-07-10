import type { SysConfigDTO } from '~/types'

interface forgotPasswordRequest {
  identify: string
}

export default defineEventHandler(async (event) => {
  const request = (await readBody(event)) as forgotPasswordRequest
  if (!request.identify.trim()) {
    return {
      success: false,
      emailCodeKey: '',
      message: '请输入用户名或邮箱',
    }
  }
  const target = await prisma.user.findFirst({
    where: {
      OR: [
        { username: request.identify },
        { email: request.identify },
      ],
    },
  })
  if (!target) {
    return {
      success: false,
      emailCodeKey: '',
      message: '发送邮件失败,请检查用户名或邮箱',
    }
  }
  const emailCode = randomId().substring(0, 6)
  const emailCodeKey = randomId()
  const ip = getHeader(event, 'x-real-ip') || getHeader(event, 'x-forwarded-for')
  const sysConfig = await prisma.sysConfig.findFirst()
  const sysConfigDTO = sysConfig?.content as unknown as SysConfigDTO
  const subject = `${sysConfigDTO.websiteName} 重置密码邮件 Reset Password Email`
  const html = `您正在重置密码，验证码是：<b>${emailCode}</b>`
  if (ip) {
    const cacheKey = `${ip}#forgotPassword`
    const count = await emailCodeCache.get(cacheKey) as number || 0
    if (count > 3) {
      return {
        success: false,
        emailCodeKey: '',
        message: '不要频繁发送邮件!',
      }
    }
    await emailCodeCache.set(cacheKey, count + 1, 5 * 60 * 1000)
  }
  const message = await sendMail(target.email, subject, html)
  if (message) {
    return {
      success: false,
      emailCodeKey: '',
      message: `发送邮件失败:${message}`,
    }
  }

  await prisma.emailCode.create({
    data: {
      key: emailCodeKey,
      code: emailCode,
      used: false,
      validAt: new Date(Date.now() + 30 * 60 * 1000),
      targetEmail: target.email,
      reason: 'RESET_PASSWORD',
    },
  })
  return {
    success: true,
    message: '发送邮件成功',
    emailCodeKey,
  }
})
