import { default as bcrypt } from 'bcryptjs'

interface resetPasswordRequest {
  identify: string
  emailCode: string
  emailCodeKey: string
  password: string
  repeatPassword: string
}

export default defineEventHandler(async (event) => {
  const request = (await readBody(event)) as resetPasswordRequest
  if (!request.identify.trim() || !request.emailCode.trim() || !request.emailCodeKey.trim() || !request.password.trim() || !request.repeatPassword.trim()) {
    return {
      success: false,
      message: '请输入完整的信息',
    }
  }
  if (request.password !== request.repeatPassword) {
    return {
      success: false,
      message: '两次密码不一致',
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
      message: '重置失败,请检查用户名或邮箱',
    }
  }
  const emailCode = await prisma.emailCode.findFirst({
    where: {
      key: request.emailCodeKey,
      used: false,
      validAt: {
        gte: new Date(),
      },
    },
  })
  if (!emailCode) {
    return {
      success: false,
      message: '验证码错误或已过期或已使用',
    }
  }
  if (emailCode.code.toUpperCase() !== request.emailCode.toUpperCase()) {
    return {
      success: false,
      message: '验证码错误',
    }
  }
  const password = bcrypt.hashSync(request.password, 10)
  await prisma.user.update({
    where: { id: target.id },
    data: {
      password,
    },
  })
  await prisma.emailCode.update({
    where: {
      id: emailCode.id,
    },
    data: {
      used: true,
    },
  })
  return {
    success: true,
    message: '重置成功',
  }
})
