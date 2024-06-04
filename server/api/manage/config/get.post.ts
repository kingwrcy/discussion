export default defineEventHandler(async (_) => {
  const config = await prisma.sysConfig.findFirst()
  return {
    success: true,
    config: config?.content,
  }
})
