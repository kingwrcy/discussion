import { PrismaClient } from '@prisma/client'
export const prisma = new PrismaClient()

export const TOKEN_KEY = process.env["TOKEN_KEY"] as string
export const JWT_KEY = process.env["KWT_KEY"] as string