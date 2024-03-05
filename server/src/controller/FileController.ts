import koaBody from "koa-body";
import { Controller, HttpMethodEnum } from "../model";
import path from "path";
import { AjaxResult } from "../util/AjaxResult";
import send from "koa-send";
import fs from "fs/promises";
const controller: Controller[] = [
  // 需要访问权限
  {
    path: "/file/upload",
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
        const file = ctx.request.files.file as any;
        ctx.body = AjaxResult.success({
          mimetype: file.mimetype,
          filename: file.newFilename,
          originalFilename: file.originalFilename,
        });
      },
    ],
  },
  // 需要访问权限
  {
    path: "/file/target/:id",
    method: HttpMethodEnum.GET,
    handler: [
      async (ctx, next) => {
        const srcPath = "/" + ctx.params.id;
        const opts: send.SendOptions = {
          root: path.join(__dirname, "../upload"),
        };
        await send(ctx, srcPath, opts);
        ctx.set("Content-Type", ctx.request.header["accept"]);
        next();
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
  // 分片上传
  // 检查文件
  {
    path: "/file/shard/check",
    method: HttpMethodEnum.POST,
    handler: [
      async (ctx) => {
        const { fileKey, shardTotalCount, fileSuffix } = ctx.request.body;
        const uploadPath = path.join(__dirname, `../upload`);
        // upload文件夹不存在时要新建一个
        try {
          await fs.access(uploadPath);
        } catch (err) {
          if (err.code === "ENOENT") {
            await fs.mkdir(uploadPath);
          } else {
            console.log(err);
          }
        }
        const allFileList = await fs.readdir(uploadPath);
        if (allFileList.includes(`${fileKey}.${fileSuffix}`)) {
          ctx.body = AjaxResult.success({
            fullUploaded: true,
          });
        } else {
          const filePath = path.join(__dirname, `../upload/${fileKey}`);

          let files = [];
          try {
            files = await fs.readdir(filePath);
          } catch (e) {
            fs.mkdir(filePath);
          }

          ctx.body = AjaxResult.success({
            uploadedShard: files,
            fullUploaded: false,
          });
        }
      },
    ],
  },
  // 上传分片
  {
    path: "/file/shard/upload",
    method: HttpMethodEnum.POST,
    handler: [
      koaBody({
        multipart: true,
        formidable: {
          uploadDir: path.join(__dirname, "../upload"),
          keepExtensions: true,
          maxFieldsSize: 2 * 1024 * 1024,
          onFileBegin(name, file) {
            // console.log(file);
          },
        },
      }),
      async (ctx) => {
        const { fileKey, shardIndex } = ctx.request.body;
        const file = ctx.request.files.file as any;
        fs.rename(
          file.filepath,
          path.join(__dirname, `../upload/${fileKey}/${shardIndex}`)
        );

        ctx.body = AjaxResult.success(`分片${shardIndex}上传成功！`);
      },
    ],
  },
  // 合并分片
  {
    path: "/file/shard/merge",
    method: HttpMethodEnum.POST,
    handler: [
      async (ctx) => {
        const { fileKey, shardTotalCount, fileSuffix } = ctx.request.body;
        const shardList = await fs.readdir(
          path.join(__dirname, `../upload/${fileKey}`)
        );
        if (shardList.length !== shardTotalCount || shardList.length === 0) {
          ctx.body = AjaxResult.success("切片数量不符！");
        } else {
          const filePath = path.join(
            __dirname,
            `../upload/${fileKey}.${fileSuffix}`
          );
          await fs.writeFile(filePath, "");
          for (let i = 0; i < shardList.length; i++) {
            const shardPath = path.join(__dirname, `../upload/${fileKey}/${i}`);
            await fs.appendFile(filePath, await fs.readFile(shardPath));
            await fs.unlink(shardPath);
          }
          await fs.rmdir(path.join(__dirname, `../upload/${fileKey}`));
          ctx.body = AjaxResult.success("合并成功！");
        }
      },
    ],
  },
];

export default controller;
