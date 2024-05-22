import short from 'short-uuid'

import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '@prisma/client'

import pg from 'pg';
const { Pool } = pg;

const connectionString = `${process.env.DATABASE_URL}`
const pool = new Pool({ connectionString })
const adapter = new PrismaPg(pool)
export const prisma = new PrismaClient({ adapter })

const config = useRuntimeConfig()

export const randomId = ()=>{
  return short.generate().toString()
}

export const getAvatarUrl = (hash:string)=>{
  return `${config.public.avatarCdn}${hash}`
}