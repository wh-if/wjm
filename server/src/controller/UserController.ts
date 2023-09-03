import { AjaxResult } from "../util/AjaxResult";
import { Controller, HttpMethodEnum } from "../model";
import jwt from "jsonwebtoken";
import { userMapper } from "../dao/mapper/UserMapper";

const controller: Controller[] = [
  // 获取用户列表
  {
    path: "/user",
    method: HttpMethodEnum.GET,
    handler: async (ctx) => {
      ctx.body = await userMapper.select({ id: 1 });
    },
  },
  // 登录
  {
    path: "/login",
    method: HttpMethodEnum.POST,
    handler: async (ctx) => {
      const { email, password } = ctx.request.body;

      const user = await userMapper.selectOne({ email });
      if (user && password === user.password) {
        // Reflect.deleteProperty(user, "id");
        Reflect.deleteProperty(user, "password");
        const token = jwt.sign({ ...user }, "WJM", { expiresIn: "30min" });
        ctx.body = AjaxResult.success("登录成功！", { ...user, token });
      } else {
        ctx.body = AjaxResult.error("用户名或密码错误！");
      }
    },
  },
  // 登出
  {
    path: "/logout",
    method: HttpMethodEnum.POST,
    handler: async (ctx) => {
      // TODO 退出登录后，对之前已经签发的token的处理
      ctx.body = AjaxResult.success("登出成功！");
    },
  },
  // 注册
  {
    path: "/register",
    method: HttpMethodEnum.POST,
    handler: async (ctx) => {
      ctx.body = ctx.is("multipart");
    },
  },
];

export default controller;
