import { sendMailWithParams } from '~/server/utils'

interface TestEmailRequest {
  host: string
  port: number
  username: string
  password: string
  secure: boolean
  to: string
  senderName: string
}

export default defineEventHandler(async (event) => {
  const request = (await readBody(event)) as TestEmailRequest
  const message = await sendMailWithParams({ ...request, subject: 'Discussion 测试邮件 Test Email', html: '这是一封测试邮件 This is a test email' })
  return {
    success: message === '',
    message,
  }
})
