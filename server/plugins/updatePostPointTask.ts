import { useScheduler } from "#scheduler";
import dayjs from "dayjs";

export default defineNitroPlugin((nitroApp) => {
  if (process.env.APP_ENV === 'build') {
  	console.log('[server/plugins/updatePostPointTask.ts] Skipping scheduler, in build context');
  	return;
  }
  const scheduler = useScheduler();

  scheduler
    .run(async () => {
      const posts = await prisma.post.findMany({
        where: {
          createdAt: {
            gte: dayjs().subtract(2, "month").toDate(),
          },
        },
        select: {
          pid: true,
          createdAt: true,
          uid: true,
          _count: {
            select: {
              PostSupport: true,
            },
          },
        },
      });

      posts.forEach(async (post) => {
        const second = dayjs().diff(post.createdAt, "second");
        const count = await prisma.comment.count({
          where: {
            pid: post.pid,
            uid: {
              not: post.uid,
            },
          },
        });
        const point =
          post._count.PostSupport * 2 + count - 1 / Math.pow(second + 600, 1.8);

        await prisma.post.update({
          where: {
            pid: post.pid,
          },
          data: {
            point,
          },
        });
        // console.log("update post point ", post.pid, point);
      });
    })
    .everyMinutes(3);
});
