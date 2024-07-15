import { sendMailWithParams } from '~/server/utils'

interface TestEmailRequest {
  email: {
    host: string
    port: number
    username: string
    password: string
    secure: boolean
    to: string
    senderName: string
  }
  url: string
}

export default defineEventHandler(async (event) => {
  const request = (await readBody(event)) as TestEmailRequest
  const message = await sendMailWithParams({ ...request.email, subject: 'Discussion 测试邮件 Test Email', html: '这是一封测试邮件 This is a test email' }, request.url)
  if (message) {
    return {
      success: false,
      message,
    }
  }
  else {
    return {
      success: true,
      message: '发送成功',
    }
  }
})
