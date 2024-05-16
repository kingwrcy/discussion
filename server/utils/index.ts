import { PrismaClient } from '@prisma/client'
import short from 'short-uuid'

export const prisma = new PrismaClient()


export const randomId = ()=>{
  return short.generate().toString()
}