export default defineEventHandler(async (event) => {
  const config = await prisma.sysConfig.findFirst({ where: { id: 1 } });
  return {
    success: true,
    config,
  };
});
