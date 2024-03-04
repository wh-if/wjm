import { AjaxResult } from "../util/AjaxResult";
import { Controller, HttpMethodEnum } from "../model";
import { collectMapper } from "../dao/mapper/CollectMapper";

const controller: Controller[] = [
  // 获取当前用户的所有收藏题目, isPublic区分收藏和公共题库
  {
    path: "/collect",
    method: HttpMethodEnum.GET,
    handler: async (ctx) => {
      const { isPublic } = ctx.query;
      const resultList = await collectMapper.getCollectList(
        isPublic === "true" ? undefined : ctx.body
      );
      ctx.body = AjaxResult.success({ resultList });
    },
  },
  // 添加收藏
  {
    path: "/collect",
    method: HttpMethodEnum.POST,
    handler: async (ctx) => {
      const { questionId } = ctx.request.body;
      const result = await collectMapper.insert({
        questionId,
        userId: ctx.body,
      });
      ctx.body = AjaxResult.success({ result });
    },
  },
  // 取消收藏
  {
    path: "/collect",
    method: HttpMethodEnum.DELETE,
    handler: async (ctx) => {
      const { questionId } = ctx.query;
      const result = await collectMapper.remove({
        questionId: parseInt(questionId as string),
        userId: ctx.body,
      });
      ctx.body = AjaxResult.success({ result });
    },
  },
];

export default controller;
