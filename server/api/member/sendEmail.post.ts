import { EmailReason } from '@prisma/client'
import { emailCodeCache } from '~/server/utils'
import type { SysConfigDTO } from '~/types'

interface SendEmailRequest {
  sence: EmailReason
  email: string
}

export default defineEventHandler(async (event) => {
  const request = (await readBody(event)) as SendEmailRequest

  let html = ''
  let subject = ''
  const emailCode = randomId().substring(0, 6)
  const emailCodeKey = randomId()
  const ip = getHeader(event, 'x-real-ip') || getHeader(event, 'x-forwarded-for')

  const sysConfig = await prisma.sysConfig.findFirst()
  const sysConfigDTO = sysConfig?.content as unknown as SysConfigDTO

  if (!sysConfigDTO.regWithEmailCodeVerify) {
    return {
      success: false,
      emailCodeKey: '',
      message: '未开启邮件验证码验证注册',
    }
  }

  if (request.sence === EmailReason.REGISTER) {
    subject = `${sysConfigDTO.websiteName} 注册邮件 Register Email`
    html = `欢迎使用<color="red"><a href='${sysConfigDTO.websiteUrl}'>${sysConfigDTO.websiteName}</a></color>，您的注册验证码是：<b>${emailCode}</b>`
  }
  else {
    return {
      success: false,
      emailCodeKey: '',
      message: '发送邮件失败',
    }
  }

  if (ip) {
    const cacheKey = `${ip}#${request.sence}`
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

  const message = await sendMail(request.email, subject, html)
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
      validAt: new Date(new Date().getTime() + 1000 * 60 * 5),
      reason: request.sence,
      targetEmail: request.email,
    },
  })
  console.log('发送注册邮件验证码:', emailCodeKey, emailCode, request.email)
  return {
    success: true,
    emailCodeKey,
    message: '发送邮件成功',
  }
})
