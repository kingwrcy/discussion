export default defineEventHandler(async (event) => {
  if (!event.context.uid) {
    return {};
  }

  const user = await prisma.user.findUnique({
    where: {
      uid: event.context.uid,
    },
    include: {
      role: true,
    },
  });
  //@ts-ignore
  delete user?.password;
  return user;
});
