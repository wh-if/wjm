import Router from "koa-router";
import fs from "fs";
import type { Controller } from "../model";

const router = new Router();

fs.readdir(__dirname, (_, files) => {
  files.forEach(async (file) => {
    if (/(.*)(?=Controller.ts)/g.test(file)) {
      import(`./${file}`).then((value) => {
        value.default.forEach((item: Controller) => {
          router.register(item.path, [item.method], item.handler);
        });
      });
    }
  });
});

export default router;
