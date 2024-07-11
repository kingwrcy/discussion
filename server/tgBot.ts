// server/telegram-bot.js

import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '@prisma/client'
import TelegramBot from 'node-telegram-bot-api'
import pg from 'pg'
import type { SysConfigDTO } from '~/types'

class TGBot {
  private static instance: TGBot
  private bot: TelegramBot | undefined
  private constructor(token?: string, proxy?: string) {
    if (token) {
      if (proxy) {
        this.bot = new TelegramBot(token, {
          polling: true,
          request: {
            proxy,
          } as any,
        })
      }
      else {
        this.bot = new TelegramBot(token, {
          polling: true,
        })
      }
    }
  }

  public getBot() {
    return this.bot
  }

  public static getInstance(token?: string, proxy?: string) {
    if (!TGBot.instance) {
      TGBot.instance = new TGBot(token, proxy)
    }

    return TGBot.instance
  }
}

async function start() {
  const { Pool } = pg

  const connectionString = `${process.env.DATABASE_URL}`
  const pool = new Pool({ connectionString })
  const adapter = new PrismaPg(pool)
  const prisma = new PrismaClient({ adapter, log: ['warn', 'error'] })
  const sysConfig = await prisma.sysConfig.findFirst()
  const sysConfigDTO = sysConfig?.content as unknown as SysConfigDTO
  const websiteName = sysConfigDTO.websiteName

  if (sysConfigDTO.notify?.tgBotEnabled && sysConfigDTO.notify.tgBotToken) {
    const bot = TGBot.getInstance(sysConfigDTO.notify.tgBotToken, sysConfigDTO.proxyUrl).getBot()!

    bot.onText(/\/bind (.+)/, async (msg, match) => {
      const chatId = msg.chat.id
      console.log('match', match)
      if (!match || match?.length === 0) {
        bot.sendMessage(chatId, `格式错误，正确格式为 /bind 你的${websiteName}用户名#你的${websiteName}邮箱地址`)
        return
      }
      const params = match[1]
      updateUserTgChatID(prisma, params, chatId.toString(), bot, chatId.toString())
    })

    bot.onText(/\/unbind (.+)/, async (msg, match) => {
      const chatId = msg.chat.id
      if (!match || match?.length === 0) {
        bot.sendMessage(chatId, `格式错误，正确格式为 /unbind 你的${websiteName}用户名#你的${websiteName}邮箱地址`)
        return
      }
      const params = match[1]
      updateUserTgChatID(prisma, params, chatId.toString(), bot)
    })

    bot.on('message', (msg) => {
      const chatId = msg.chat.id

      if (msg.text === '/bind') {
        bot.sendMessage(chatId, `绑定时需要带上用户名和注册邮箱,中间使用#号分割，例如/bind 你的${websiteName}用户名#你的${websiteName}邮箱地址`)
      }
      else if (msg.text === '/unbind') {
        bot.sendMessage(chatId, `解除绑定时需要带上用户名和注册邮箱,中间使用#号分割，例如/unbind 你的${websiteName}用户名#你的${websiteName}邮箱地址`)
      }
    })

    console.log('[tg机器人已经在后台启动...]')

    return bot
  }
}

async function updateUserTgChatID(prisma: PrismaClient, params: string, chatID: string, bot: TelegramBot, value?: string) {
  if (params.split('#').length !== 2) {
    bot.sendMessage(chatID, `格式不正确`)
    return
  }
  const [username, email] = params.split('#')
  const user = await prisma.user.findUnique({
    where: { username, email },
  })
  if (!user) {
    bot.sendMessage(chatID, `不存在${username}#${email}这个用户`)
    return
  }
  await prisma.user.update({
    where: { username },
    data: { tgChatID: value },
  })
  bot.sendMessage(chatID, '恭喜你，操作成功！')
}

start()

export default TGBot
