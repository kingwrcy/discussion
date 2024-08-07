import dayjs from 'dayjs'

export default defineEventHandler(async () => {
  const users = await prisma.pointHistory.groupBy({
    by: ['uid'],
    where: {
      createdAt: {
        gt: dayjs().subtract(3, 'day').toDate(),
      },
      reason: {
        notIn: ['INVITE', 'PUTIN'],
      },
    },
    _sum: {
      point: true,
    },
    orderBy: {
      _sum: {
        point: 'desc',
      },
    },
    take: 10,
    skip: 0,
  })
  const uids = users.filter(user => (user._sum.point ?? 0) > 0).map(user => user.uid)
  const userInfos = await prisma.user.findMany({
    where: {
      uid: {
        in: uids,
      },
    },
    select: {
      username: true,
      uid: true,
      avatarUrl: true,
      headImg: true,
    },
  })
  return users.map((user) => {
    const target = userInfos.find(userInfo => userInfo.uid === user.uid)
    return { points: user._sum.point, ...target }
  })
})
