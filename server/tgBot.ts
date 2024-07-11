// server/telegram-bot.js

import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '@prisma/client'
import TelegramBot from 'node-telegram-bot-api'
import pg from 'pg'
import type { SysConfigDTO } from '~/types'

async function start() {
  const { Pool } = pg

  const connectionString = `${process.env.DATABASE_URL}`
  const pool = new Pool({ connectionString })
  const adapter = new PrismaPg(pool)
  const prisma = new PrismaClient({ adapter, log: ['warn', 'error'] })
  const sysConfig = await prisma.sysConfig.findFirst()
  const sysConfigDTO = sysConfig?.content as unknown as SysConfigDTO

  if (sysConfigDTO.notify?.tgBotEnabled && sysConfigDTO.notify.tgBotToken) {
    const request = {} as any
    if (sysConfigDTO.proxyUrl) {
      request.proxy = sysConfigDTO.proxyUrl
    }

    const bot = new TelegramBot(sysConfigDTO.notify.tgBotToken, {
      polling: true,
      request,
    })

    bot.onText(/\/bind (.+)/, async (msg, match) => {
      const chatId = msg.chat.id
      console.log('match', match)
      if (!match || match?.length === 0) {
        bot.sendMessage(chatId, '格式错误，正确格式为 /bind 你的极简论坛用户名#你的极简论坛邮箱地址')
        return
      }
      const params = match[1]
      const splits = params.split('#')
      if (!splits || splits.length !== 2) {
        bot.sendMessage(chatId, '格式错误，正确格式为 /bind 你的极简论坛用户名#你的极简论坛邮箱地址')
        return
      }
      const [username, email] = splits
      const user = await prisma.user.findUnique({
        where: { username, email },
      })
      if (!user) {
        bot.sendMessage(chatId, `不存在${username}#${email}这个用户`)
        return
      }
      await prisma.user.update({
        where: { username },
        data: { tgChatID: chatId.toString() },
      })

      bot.sendMessage(chatId, '恭喜你，绑定成功！')
    })

    bot.onText(/\/unbind (.+)/, async (msg, match) => {
      const chatId = msg.chat.id
      if (!match || match?.length === 0) {
        bot.sendMessage(chatId, '格式错误，正确格式为 /bind 你的极简论坛用户名#你的极简论坛邮箱地址')
        return
      }
      const params = match[1]
      const splits = params.split('#')
      if (!splits || splits.length !== 2) {
        bot.sendMessage(chatId, '格式错误，正确格式为 /bind 你的极简论坛用户名#你的极简论坛邮箱地址')
        return
      }
      const [username, email] = splits
      const user = await prisma.user.findUnique({
        where: { username, email },
      })
      if (!user) {
        bot.sendMessage(chatId, `不存在${username}#${email}这个用户`)
        return
      }
      await prisma.user.update({
        where: { username },
        data: { tgChatID: null },
      })

      bot.sendMessage(chatId, '恭喜你，解除绑定成功！')
    })

    bot.on('message', (msg) => {
      const chatId = msg.chat.id

      if (msg.text === '/bind') {
        bot.sendMessage(chatId, '绑定时需要带上用户名和注册邮箱,中间使用#号分割，例如/bind 你的极简论坛用户名#你的极简论坛邮箱地址')
      }
      else if (msg.text === '/unbind') {
        bot.sendMessage(chatId, '解除绑定时需要带上用户名和注册邮箱,中间使用#号分割，例如/unbind 你的极简论坛用户名#你的极简论坛邮箱地址')
      }
    })

    console.log('[tg机器人已经在后台启动...]')
  }
}

start()
