import { UserRole } from '@prisma/client'
import jwt from 'jsonwebtoken'
import type { JwtPayload } from '~/types'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const token = getCookie(event, config.public.tokenKey)
  const url = getRequestURL(event)

  if (token && url.pathname === '/login') {
    await sendRedirect(event, '/', 302)
    return
  }

  if (token) {
    try {
      const result = jwt.verify(token, config.jwtSecretKey)
      const payload = result as JwtPayload
      event.context.uid = payload.uid
      event.context.userId = payload.userId
    }
    catch (e) {
      console.log(e)
      throw createError('登录信息已失效,请重新登录')
    }
  }

  if (url.pathname.startsWith('/manage')) {
    if (!token) {
      throw createError('请先登录')
    }
    const user = await prisma.user.findUnique({
      where: { uid: event.context.uid },
    })
    if (!user) {
      throw createError('登录信息已失效,请重新登录')
    }
    if (user.role !== UserRole.ADMIN) {
      throw createError('只有管理员才能访问')
    }
  }
})
