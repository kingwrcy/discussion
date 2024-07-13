import short from 'short-uuid'

import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '@prisma/client'
import nodemailer from 'nodemailer'

import { createCache, memoryStore } from 'cache-manager'
import pg from 'pg'
// import TelegramBot from 'node-telegram-bot-api'
// import TGBot from '../tgBot'
import type { SysConfigDTO, recaptchaResponse } from '~/types'

const { Pool } = pg

const connectionString = `${process.env.DATABASE_URL}`
const pool = new Pool({ connectionString })
const adapter = new PrismaPg(pool)
export const prisma = new PrismaClient({ adapter, log: ['warn', 'error'] })

const config = useRuntimeConfig()

export function randomId() {
  return short.generate().toString()
}

export function getAvatarUrl(hash: string) {
  return `${config.public.avatarCdn}${hash}`
}

export const emailCodeCache = createCache(memoryStore({
  max: 100,
  ttl: 5 * 60 * 1000,
}))

export async function sendMail(to: string, subject: string, html: string) {
  const config = await prisma.sysConfig.findFirst({})
  const sysConfigDTO = config?.content as unknown as SysConfigDTO
  const { host, port, username, password, senderName } = sysConfigDTO.email
  if (host === '' || port === 0 || username === '' || password === '' || senderName === '') {
    return '请先配置邮箱'
  }

  return sendMailWithParams({ ...sysConfigDTO.email, to, subject, html }, sysConfigDTO.ForwardUrl)
}

export interface sendMailParams {
  host: string
  username: string
  port: number
  secure: boolean
  password: string
  to: string
  subject: string
  html: string
  senderName: string
}

export async function sendMailWithParams({ host, username, port, secure, password, to, subject, html, senderName }: sendMailParams, url: string) {
  if (host === '' || port === 0 || username === '' || password === '' || senderName === '') {
    return '请先配置邮箱'
  }
  if (url) {
    const res: any = await fetch(url, {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ host, username, port, secure, password, to, subject, html, senderName }),
    })
    const body = await res.json()
    return body.message
  }

  try {
    const transporter = nodemailer.createTransport({
      host,
      port,
      secure,
      auth: {
        user: username,
        pass: password,
      },
      dnsTimeout: 3000,
      socketTimeout: 3000,
      greetingTimeout: 3000,
      connectionTimeout: 3000,
    })

    await transporter.sendMail({
      from: `${senderName} <${username}>`,
      to,
      subject,
      html,
    })
  }
  catch (e: any) {
    console.log(e)
    return `发送邮件失败${'message' in e ? e.message : ''}`
  }
  return ''
}

export async function checkGoogleRecaptcha(sk: string, token?: string) {
  if (!token) {
    return {
      success: false,
      message: '请先通过人机验证',
    }
  }
  const url = `https://recaptcha.net/recaptcha/api/siteverify?secret=${sk}&response=${token}`
  const response = (await $fetch(url)) as any as recaptchaResponse
  if (response.success === false) {
    return {
      success: false,
      message: '傻逼,还来??',
    }
  }
  if (response.score <= 0.5) {
    return {
      success: false,
      message: '二货,你是不是人机?',
    }
  }
  return {
    success: true,
    message: '验证通过',
  }
}

export async function sendTgMessage(sysConfigDTO: SysConfigDTO, chatId: string | null, message: string) {
  if (!chatId) {
    return
  }
  if (sysConfigDTO.notify?.tgBotEnabled && sysConfigDTO.notify.tgBotToken) {
    let url = sysConfigDTO.notify.tgProxyUrl ? sysConfigDTO.notify.tgProxyUrl : 'https://api.telegram.org'
    if (url.endsWith('/')) {
      url = url.substring(0, url.length - 1)
    }
    const target = `${url}/bot${sysConfigDTO.notify.tgBotToken}/sendMessage`
    console.log(new Date(), '开始发送tg消息通知，chatId:', chatId, 'message:', message, target)
    try {
      const res = await fetch(target, {
        method: 'POST',
        body: JSON.stringify({
          chat_id: chatId,
          text: message,
          parse_mode: 'MarkdownV2',
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      })
      const resJson = await res.json()
      console.log('tg消息发送结果:', resJson)
    }
    catch (e) {
      console.log('tg消息发送失败:', e)
    }
  }
}
