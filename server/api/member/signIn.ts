import { PointReason } from "@prisma/client";
import { SysConfigDTO } from "~/types";

function getTodayMidnight() {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  return now;
}

export default defineEventHandler(async (event) => {
  if (!event.context.uid) {
    throw createError("请先去登录");
  }

  const count = await prisma.pointHistory.count({
    where: {
      uid: event.context.uid,
      createdAt: {
        gte: getTodayMidnight(),
      },
      reason: PointReason.SIGNIN,
    },
  });

  if (count > 0) {
    return {
      success: false,
      message: "今天已经签到过了,请不要反复签到",
    };
  }
  const sysConfig = await prisma.sysConfig.findFirst();
  const sysConfigDTO = sysConfig?.content as SysConfigDTO;
  const point = getRandomIntWeighted(
    sysConfigDTO.pointPerDaySignInMin,
    sysConfigDTO.pointPerDaySignInMax
  );
  await prisma.pointHistory.create({
    data: {
      uid: event.context.uid,
      point,
      reason: PointReason.SIGNIN,
    },
  });
  return {
    success: true,
    message: `签到成功,获得${point}积分`,
  };
});

function getRandomIntWeighted(min: number, max: number) {
  // 确保 min 和 max 是整数
  min = Math.ceil(min);
  max = Math.floor(max);

  // 计算权重分界点
  const mid = Math.floor((min + max) / 2);

  // 生成一个 0 到 1 之间的随机数
  const random = Math.random();

  if (random < 0.8) {
    // 80% 的概率选择 min 到 mid 之间的数
    return Math.floor(Math.random() * (mid - min + 1)) + min;
  } else {
    // 20% 的概率选择 mid + 1 到 max 之间的数
    return Math.floor(Math.random() * (max - mid)) + (mid + 1);
  }
}
