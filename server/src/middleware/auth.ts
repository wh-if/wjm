import jwt from "jsonwebtoken";
import { AjaxResult } from "../util/AjaxResult";
import Koa from "koa";

// 退出登录后，对之前已经签发的token的处理
const logoutedTokenSet = new Set<string>();
// 不需要权限的接口
const whiteList = [
  "/login",
  "/register",
  "/static",
  "/verify",
  "/register",
  "/token",
];

export const auth: () => Koa.Middleware<
  Koa.DefaultState,
  Koa.DefaultContext,
  any
> = () => {
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
        let resultCode: 1 | 2 = 1;
        if (ctx.headers.refresh_token as string) {
          resultCode = 2;
        }
        ctx.body = AjaxResult.error(
          "token 已过期或不存在, 请重新登录",
          resultCode
        );
        return;
      }
    }
    await next();
  };
};

export function setLogoutToken(token: string) {
  logoutedTokenSet.add(token);
  setTimeout(() => {
    logoutedTokenSet.delete(token);
  }, 31 * 1000);
}
