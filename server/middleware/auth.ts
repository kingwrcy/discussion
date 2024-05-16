import jwt from "jsonwebtoken";
import { JwtPayload } from "~/types";

export default defineEventHandler(async (event) => {
  const token = getCookie(event, TOKEN_KEY);
  const url = getRequestURL(event);

  if (token && url.pathname === "/login") {
    await sendRedirect(event, "/", 302);
    return;
  }

  if (token) {
    try {
      const result = jwt.verify(token, JWT_KEY);
      const payload = result as JwtPayload;
      event.context.userId = payload.id;
    } catch (e) {
      throw createError("登录信息已失效,请重新登录");
    }
  }
});
