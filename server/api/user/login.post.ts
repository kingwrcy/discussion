import { date, z } from "zod";
import jwt from "jsonwebtoken";
import { default as bcrypt } from "bcryptjs";
import { loginRequestSchema } from "~/types";

type regRequest = z.infer<typeof loginRequestSchema>;

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
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
      uid: user.uid,
      userId: user.id,
    },
    config.jwtSecretKey,
    {
      expiresIn: 60 * 60 * 24 * 10,
    }
  );

  await prisma.user.update({
    where: {
      uid: user.uid,
    },
    data: {
      lastLogin: new Date(),
    },
  });

  setCookie(event, config.public.tokenKey, token, {
    secure: true,
    expires: new Date(Date.now() + 60 * 60 * 24 * 1000 * 10),
  });

  return { success: true, token, tokenKey: config.public.tokenKey };
});
