import koaBody from "koa-body";
import { Controller, HttpMethodEnum } from "../model";
import path from "path";
import { AjaxResult } from "../util/AjaxResult";
import send from "koa-send";
const controller: Controller[] = [
  // 需要访问权限
  {
    path: "/upload",
    method: HttpMethodEnum.POST,
    handler: [
      koaBody({
        multipart: true,
        formidable: {
          uploadDir: path.join(__dirname, "../upload"),
          keepExtensions: true,
          maxFieldsSize: 2 * 1024 * 1024,
        },
      }),
      (ctx) => {
        // console.log(ctx.request.files);
        ctx.body = AjaxResult.success();
      },
    ],
  },
  // 公开的，不需要权限访问,上传
  {
    path: "/public",
    method: HttpMethodEnum.POST,
    handler: [
      koaBody({
        multipart: true,
        formidable: {
          uploadDir: path.join(__dirname, "../public"),
          keepExtensions: true,
          maxFieldsSize: 2 * 1024 * 1024,
        },
      }),
      (ctx) => {
        // console.log(ctx.request.files);
        ctx.body = AjaxResult.success();
      },
    ],
  },
  // 静态资源
  {
    path: "/static/:id",
    method: HttpMethodEnum.GET,
    handler: [
      async (ctx, next) => {
        const srcPath = "/" + ctx.params.id;
        const opts = { root: path.join(__dirname, "../public") };
        await send(ctx, srcPath, opts);
        next();
      },
    ],
  },
];

export default controller;
