export default defineEventHandler(async (event) => {
  const tags = await prisma.tag.findMany();
  return {
    success: true,
    tags,
  };
});
