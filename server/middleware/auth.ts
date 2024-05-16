import jwt from "jsonwebtoken";
import { JwtPayload } from "~/types";

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const token = getCookie(event, config.public.tokenKey);
  const url = getRequestURL(event);

  if (token && url.pathname === "/login") {
    await sendRedirect(event, "/", 302);
    return;
  }

  if (token) {
    try {
      const result = jwt.verify(token, config.jwtSecretKey);
      const payload = result as JwtPayload;
      event.context.uid = payload.uid;
    } catch (e) {
      console.log(e)
      throw createError("登录信息已失效,请重新登录");
    }
  }
});
