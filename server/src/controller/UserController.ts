import { AjaxResult } from "../util/AjaxResult";
import { Controller, HttpMethodEnum } from "../model";
import jwt from "jsonwebtoken";
import { userMapper } from "../dao/mapper/UserMapper";
import { checkCode, genVerifyCodeImg, generateCode } from "../util/VerifyCode";
import { setLogoutToken } from "../middleware/auth";

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
      const { email, password, vcode } = ctx.request.body;
      let compareResult: boolean = false;

      // 验证码登录
      if (!password) {
        compareResult = checkCode(email, vcode);
        if (!compareResult) {
          ctx.body = AjaxResult.error("验证码错误！");
          return;
        }
      }

      const user = await userMapper.selectOne({ email });
      if (!user) {
        ctx.body = AjaxResult.error("用户名或密码错误！");
        return;
      }

      // 密码登录
      if (password) {
        compareResult = password === user.password;
      }

      console.log("-----------------------------------------------");

      if (compareResult) {
        // Reflect.deleteProperty(user, "id");
        Reflect.deleteProperty(user, "password");
        const token = jwt.sign({ ...user }, "WJM", { expiresIn: "30min" });
        const refresh_token = jwt.sign({ ...user }, "WJM", {
          expiresIn: "24h",
        });
        ctx.body = AjaxResult.success("登录成功！", {
          ...user,
          token,
          refresh_token,
        });
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
      // 退出登录后，对之前已经签发的token的处理
      setLogoutToken(ctx.headers.token as string);
      setLogoutToken(ctx.headers.refresh_token as string);
      ctx.body = AjaxResult.success("登出成功！");
    },
  },
  // 注册
  {
    path: "/register",
    method: HttpMethodEnum.POST,
    handler: async (ctx) => {
      const { email, password, vcode } = ctx.request.body;
      if (checkCode(email, vcode)) {
        const result = await userMapper.insert({
          name: email,
          email,
          password,
          status: 0,
        });
        ctx.body = AjaxResult.success("注册成功！");
      } else {
        ctx.body = AjaxResult.error("验证码错误或已经过期！");
      }
    },
  },
  // 忘记密码、修改密码
  {
    path: "/password",
    method: HttpMethodEnum.POST,
    handler: async (ctx) => {
      const { email, password, vcode } = ctx.request.body;

      if (checkCode(email, vcode)) {
        const result = await userMapper.update({ password }, { email });
        AjaxResult.success({ result });
      } else {
        ctx.body = AjaxResult.error("验证码错误或已经过期！");
      }
    },
  },
  // 修改用户信息
  {
    path: "/user",
    method: HttpMethodEnum.PUT,
    handler: async (ctx) => {
      const { name, status } = ctx.request.body;

      const result = await userMapper.update(
        { name, status },
        { id: ctx.body }
      );
      ctx.body = AjaxResult.success({ result });
    },
  },
  // 获取验证码 type 1 发送到邮箱 0 不发
  {
    path: "/verify/:type",
    method: HttpMethodEnum.GET,
    handler: async (ctx) => {
      const { email } = ctx.query;
      const { type } = ctx.params;
      const user = await userMapper.selectOne({ email: email as string });
      if (!user) {
        ctx.body = AjaxResult.error(
          "该用户不存在，请确认输入是否正确或先注册！"
        );
        return;
      }

      const codeText = generateCode(email as string);

      if (type == "1") {
        // TODO 发送到邮箱
        console.log("codeText: " + codeText);
        ctx.body = AjaxResult.success("验证码已发送，请查看邮箱！");
      } else {
        const codeImg = genVerifyCodeImg(codeText);
        ctx.body = AjaxResult.success({ codeImg });
      }
    },
  },

  // 刷新Token
  {
    path: "/token",
    method: HttpMethodEnum.POST,
    handler: async (ctx) => {
      const refresh_token = ctx.headers.refresh_token as string;

      try {
        const { id } = jwt.verify(refresh_token, "WJM") as Record<string, any>;
        const user = await userMapper.selectOne({ id });
        Reflect.deleteProperty(user, "password");

        const new_token = jwt.sign({ ...user }, "WJM", { expiresIn: "30min" });
        const new_refresh_token = jwt.sign({ ...user }, "WJM", {
          expiresIn: "24h",
        });
        ctx.body = AjaxResult.success({
          ...user,
          token: new_token,
          refresh_token: new_refresh_token,
        });
      } catch (error) {
        ctx.body = AjaxResult.error("token 已过期或不存在, 请重新登录");
        return;
      }
    },
  },
];

export default controller;
