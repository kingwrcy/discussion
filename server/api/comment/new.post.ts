import { MessageType, PointReason, UserStatus } from '@prisma/client'
import dayjs from 'dayjs'
import { checkGoogleRecaptcha, sendTgMessage } from '~/server/utils'
import type { SysConfigDTO } from '~/types'

interface commentRequest {
  content: string
  pid: string
  cid: string
  token?: string
}

function extractMentions(text: string) {
  const regex = /\[@([^\]]+)\]/g
  return (text.match(regex) || []).map(match => match.slice(1, -1))
}

export default defineEventHandler(async (event) => {
  if (!event.context.uid) {
    await sendRedirect(event, '/member/login')
  }
  const request = (await readBody(event)) as commentRequest
  if (!request.content) {
    throw createError('评论内容不能为空')
  }

  const mentioned = extractMentions(request.content)
  const cid = request.cid ? request.cid : `c${randomId()}`

  const user = await prisma.user.findUnique({
    where: { uid: event.context.uid },
  })
  if (!user || user.status === UserStatus.BANNED) {
    throw createError('用户不存在或已被封禁')
  }
  if (user.point <= 0) {
    throw createError('用户积分小于或等于0分,不能回帖')
  }

  const post = await prisma.post.findUnique({
    where: { pid: request.pid },
    include: {
      author: {
        select: {
          uid: true,
          username: true,
          tgChatID: true,
        },
      },
    },
  })
  if (!post) {
    throw createError('帖子不存在')
  }
  const {
    _max: { floor: maxFloor },
  } = await prisma.comment.aggregate({
    _max: {
      floor: true,
    },
    where: {
      pid: request.pid,
    },
  })

  // 如果提及的是楼主,则从提及的列表里删除楼主
  const index = mentioned.indexOf(`@${post.author.username}`)
  if (index >= 0) {
    mentioned.splice(index, 1)
  }

  await prisma.comment.upsert({
    where: {
      cid,
    },
    update: {
      content: request.content,
    },
    create: {
      content: request.content,
      cid,
      pid: request.pid,
      uid: event.context.uid,
      mentioned,
      floor: (maxFloor ?? 0) + 1,
    },
  })

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

  let {
    _sum: { point: totalToday },
  } = await prisma.pointHistory.aggregate({
    _sum: {
      point: true,
    },
    where: {
      uid: event.context.uid,
      reason: PointReason.COMMENT,
      createdAt: {
        gte: dayjs().startOf('day').toDate(),
        lte: dayjs().endOf('day').toDate(),
      },
    },
  })
  totalToday = totalToday ?? 0
  const limit = totalToday >= sysConfigDTO.pointPerCommentByDay

  await prisma.post.update({
    where: {
      pid: request.pid,
    },
    data: {
      lastCommentTime: new Date(),
      lastCommentUid: event.context.uid,
    },
  })
  // 编辑回复不需要
  if (request.cid) {
    return { success: true }
  }

  mentioned.forEach(async (user) => {
    const username = user.slice(1)
    const target = await prisma.user.findUnique({ where: { username } })
    if (target) {
      await prisma.message.create({
        data: {
          content: `你在帖子<a class="text-blue-500 mx-1" href='/post/${request.pid}#${cid}'>${post.title}</a>中被提到了`,
          read: false,
          toUid: target.uid,
          type: MessageType.MENTIONED,
          relationId: request.pid,
        },
      })
      await sendTgMessage(sysConfigDTO, target.tgChatID, `你在帖子[${post.title}](${sysConfigDTO.websiteUrl}/post/${request.pid}#${cid})中被提到了`)
    }
  })

  await prisma.user.update({
    where: {
      uid: user.uid,
    },
    data: {
      lastActive: new Date(),
      point: {
        increment: limit ? 0 : sysConfigDTO.pointPerComment,
      },
      commentCount: {
        increment: 1,
      },
    },
  })

  await prisma.post.update({
    where: {
      pid: request.pid,
    },
    data: {
      replyCount: {
        increment: 1,
      },
    },
  })

  if (!limit) {
    await prisma.pointHistory.create({
      data: {
        uid: event.context.uid,
        pid: request.pid,
        cid,
        point: sysConfigDTO.pointPerComment,
        reason: PointReason.COMMENT,
      },
    })
  }

  if (event.context.uid !== post.author.uid) {
    await prisma.message.create({
      data: {
        content: `你的帖子<a class="mx-1 text-blue-500" href='/post/${request.pid}#${cid}'>${post.title}</a>有了新回复`,
        read: false,
        toUid: post.author.uid,
        type: MessageType.COMMENT,
        relationId: request.pid,
      },
    })
    await sendTgMessage(sysConfigDTO, post.author.tgChatID, `你在帖子[${post.title}](${sysConfigDTO.websiteUrl}/post/${request.pid}#${cid})中被提到了`)
  }
  return { success: true }
})
