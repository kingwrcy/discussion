export default defineEventHandler(async (event) => {

  const username = getRouterParam(event, 'username')

  if(!username){
    throw createError('用户不存在')
  }
  
  const user = await prisma.user.findUnique({
    where: {
      username
    },
    include: {
      role: true,      
      _count: {
        select:{
          fav:true
        }
      }
    },
  });
  //@ts-ignore
  delete user?.password;
  return user;
});
