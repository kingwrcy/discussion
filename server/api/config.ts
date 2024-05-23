export default defineEventHandler(async (event) => {
  const config = await prisma.sysConfig.findFirst({
    select: {
      content: true,
    },
  });
  return {
    success: true,
    data: config?.content,
  };
});
