import short from 'short-uuid'

import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '@prisma/client'
import nodemailer from 'nodemailer'

import pg from 'pg'
import { createCache, memoryStore } from 'cache-manager'
import type { SysConfigDTO } from '~/types'

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

  return sendMailWithParams({ ...sysConfigDTO.email, to, subject, html })
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

export async function sendMailWithParams({ host, username, port, secure, password, to, subject, html, senderName }: sendMailParams) {
  if (host === '' || port === 0 || username === '' || password === '' || senderName === '') {
    return '请先配置邮箱'
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
