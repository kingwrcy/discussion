import { PrismaClient } from '@prisma/client'
import short from 'short-uuid'

export const prisma = new PrismaClient()

const config = useRuntimeConfig()

export const randomId = ()=>{
  return short.generate().toString()
}

export const getAvatarUrl = (hash:string)=>{
  return `${config.public.avatarCdn}${hash}`
}