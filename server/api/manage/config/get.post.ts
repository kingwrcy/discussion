export default defineEventHandler(async (event) => {
  const config = await prisma.sysConfig.findFirst();
  return {
    success: true,
    config:config?.content,
  };
});
