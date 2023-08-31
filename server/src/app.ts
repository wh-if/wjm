import Koa from "Koa";
import router from "./controller/router";
import koaBody from "koa-body";

// 创建并设置 app
const app = new Koa();

app.use(koaBody());
app.use(router.routes());
app.use(router.allowedMethods());

// 跨域
// app.use(async (ctx, next) => {
//   ctx.set("Access-Control-Allow-Origin", "*");
//   ctx.set("Access-Control-Allow-Methods", "*");
//   ctx.set("Access-Control-Allow-Headers", "content-type");
//   await next();
// });

app.listen(8080, () => {
  console.log("服务启动成功，running http://127.0.0.1:8080");
});
