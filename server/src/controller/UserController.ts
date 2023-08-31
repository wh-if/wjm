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
      ctx.body = await userMapper.select({ id: "1" });
    },
  },
  // 登录
  {
    path: "/login",
    method: HttpMethodEnum.POST,
    handler: async (ctx) => {
      const { accountNumber, password } = ctx.request.body;
      const user = await userMapper.selectOne({ accountNumber });
      if (user && password === user.password) {
        Reflect.deleteProperty(user, "id");
        Reflect.deleteProperty(user, "password");
        const token = jwt.sign({ ...user }, "WJM");
        ctx.body = AjaxResult.success("登录成功！", { ...user, token });
      } else {
        ctx.body = AjaxResult.error("用户名或密码错误！");
      }
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
