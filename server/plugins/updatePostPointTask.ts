import dayjs from 'dayjs'
import { useScheduler } from '#scheduler'

export default defineNitroPlugin((_) => {
  if (process.env.APP_ENV === 'build') {
    console.log(
      '[server/plugins/updatePostPointTask.ts] Skipping scheduler, in build context',
    )
    return
  }
  const scheduler = useScheduler()

  const updateUserLevel = async (min: number, max: number, level: number) => {
    return await prisma.user.updateMany({
      where: {
        point: {
          gte: min,
          lt: max,
        },
      },
      data: {
        level,
      },
    })
  }

  scheduler.run(async () => {
    const levels = [
      [0, 200],
      [200, 400],
      [400, 900],
      [900, 1600],
      [1600, 2500],
      [2500, 3600],
    ]
    for (let level = 1; level <= levels.length; level++) {
      await updateUserLevel(levels[level][0], levels[level][1], level + 1)
    }
  }).everyHours(1)

  scheduler
    .run(async () => {
      const posts = await prisma.post.findMany({
        where: {
          createdAt: {
            gte: dayjs().subtract(2, 'month').toDate(),
          },
        },
        select: {
          pid: true,
          createdAt: true,
          uid: true,
          author: {
            select: { point: true },
          },
          _count: {
            select: {
              PostSupport: true,
            },
          },
        },
      })

      posts.forEach(async (post) => {
        const second = dayjs().diff(post.createdAt, 'second')
        const count = await prisma.comment.count({
          where: {
            pid: post.pid,
            uid: {
              not: post.uid,
            },
          },
        })
        const point
          = ((post.author.point * 2 + post._count.PostSupport * 2 + count - 1)
          / (second + 600) ** 1.1)
          * 10000000
        await prisma.post.update({
          where: {
            pid: post.pid,
          },
          data: {
            point,
          },
        })
        // console.log("update post point ", post.pid, point);
      })
    })
    .everyMinutes(3)
})
