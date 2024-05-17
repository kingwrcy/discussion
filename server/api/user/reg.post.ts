import { z } from "zod";

import { default as bcrypt } from "bcryptjs";
import { regRequestSchema } from "~/types";
import {sha256} from 'js-sha256'

type regRequest = z.infer<typeof regRequestSchema>;

export default defineEventHandler(async (event) => {
  const request = (await readBody(event)) as regRequest;
  const validateResult = regRequestSchema.safeParse(request);
  if (!validateResult.success) {
    return {
      success: false,
      message: validateResult.error.issues.map((e) => e.message).join(","),
    };
  }

  const count = await prisma.user.count({
    where: { OR: [{ username: request.username }, { email: request.email }] },
  });
  if (count > 0) {
    return {
      success: false,
      message: "111用户名/邮箱已经存在了",
    };
  }
  const uid = `u${randomId()}`
  try {
    await prisma.user.create({
      data: {
        uid: uid,
        username: request.username,
        password: bcrypt.hashSync(request.password, 10),
        email: request.email,
        roleId: 1,
        avatarUrl:sha256(request.email)
      },
    });
  } catch (e) {
    console.log('uid',uid,e)
    return {
      success: false,
      message: "用户名/邮箱已经存在了",
    };
  }

  return { success: true };
});
