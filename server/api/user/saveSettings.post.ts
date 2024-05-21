import { default as bcrypt } from "bcryptjs";
import { sha256 } from "js-sha256";
import { z } from "zod";
import { saveSettingsRequestSchema } from "~/types";
type regRequest = z.infer<typeof saveSettingsRequestSchema>;

export default defineEventHandler(async (event) => {
  if (!event.context.uid) {
    throw createError("请先去登录");
  }
  const config = useRuntimeConfig();
  const request = (await readBody(event)) as regRequest;
  const validateResult = saveSettingsRequestSchema.safeParse(request);
  if (!validateResult.success) {
    return {
      success: false,
      message: validateResult.error.issues.map((e) => e.message).join(","),
    };
  }

  if (request.password) {
    await prisma.user.update({
      where: {
        uid: event.context.uid,
      },
      data: {
        password: bcrypt.hashSync(request.password, 10),
        email: request.email.trim(),
      },
    });
  } else {
    await prisma.user.update({
      where: {
        uid: event.context.uid,
      },
      data: {
        email: request.email.trim(),
        avatarUrl:sha256(request.email.trim())
      },
    });
  }

  if (request.password) {
    setCookie(event, config.public.tokenKey, "", {
      expires: new Date(0),
      path: "/",
    });
  }
  return {
    success: true,
  };
});
