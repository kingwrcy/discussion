import { z } from "zod";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { loginRequestSchema } from "~/types";

type regRequest = z.infer<typeof loginRequestSchema>;

export default defineEventHandler(async (event) => {
  const request = (await readBody(event)) as regRequest;
  const validateResult = loginRequestSchema.safeParse(request);
  if (!validateResult.success) {
    return {
      success: false,
      message: validateResult.error.issues.map((e) => e.message).join(","),
    };
  }

  const user = await prisma.user.findFirst({
    where: { username: request.username },
  });
  if (!user) {
    return {
      success: false,
      message: "用户名/密码不正确",
    };
  }

  if (!bcrypt.compareSync(request.password, user.password)) {
    return {
      success: false,
      message: "用户名/密码不正确",
    };
  }

  const token = jwt.sign(
    {
      username: request.username,
      id: user.id,
      roleId:user.roleId
    },
    process.env["JWT_KEY"] as string,
    {    
      expiresIn: 60 * 60 * 24 * 10,
    }
  );

  setCookie(event, process.env["TOKEN_KEY"] as string, token, {
    secure: true,
    expires: new Date(Date.now() + 60 * 60 * 24 * 1000 *10),
  });

  return { success: true, token };
});
