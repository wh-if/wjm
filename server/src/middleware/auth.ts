import jwt from "jsonwebtoken";
import { AjaxResult } from "../util/AjaxResult";
import Koa from "koa";

export const auth: () => Koa.Middleware<
  Koa.DefaultState,
  Koa.DefaultContext,
  any
> = () => {
  const whiteList = ["/login", "/register", "/static"];
  return async (ctx, next) => {
    const findIndex = whiteList.findIndex((item) => ctx.path.startsWith(item));
    if (findIndex === -1) {
      try {
        const { id } = jwt.verify(ctx.headers.token as string, "WJM") as Record<
          string,
          any
        >;
        // 提供当前的用户信息给后面的路由使用
        ctx.body = id;
      } catch (error) {
        ctx.body = AjaxResult.error("token 已过期或不存在, 请重新登录");
        return;
      }
    }
    await next();
  };
};
