import { z } from "zod";

import bcrypt from "bcrypt";
import { regRequestSchema } from "~/types";


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
      message: "用户名/邮箱已经存在了",
    };
  }

  await prisma.user.create({
    data: {
      username: request.username,
      password: bcrypt.hashSync(request.password,10),
      email: request.email,
      roleId: 1,
    },
  });

  return { success: true };
});
