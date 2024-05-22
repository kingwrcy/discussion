import { Prisma, UserStatus } from "@prisma/client";
type BanUserRequest = {
  uid?: string;
  day: number;
};

function addDaysToDate(n: number) {
  // 获取当前日期
  var currentDate = new Date();

  // 设置日期为当前日期加上n天
  currentDate.setDate(currentDate.getDate() + n);

  // 返回新的日期对象
  return currentDate;
}

export default defineEventHandler(async (event) => {
  const request = (await readBody(event)) as BanUserRequest;
  await prisma.user.update({
    where: {
      uid: request.uid,
    },
    data: {
      status: UserStatus.BANNED,
      bannedEnd: addDaysToDate(request.day),
    },
  });
  return {
    success: true,
  };
});
