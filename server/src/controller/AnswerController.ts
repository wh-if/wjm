import { AjaxResult } from "../util/AjaxResult";
import { Controller, HttpMethodEnum } from "../model";
import { Answer, answerMapper } from "../dao/mapper/AnswerMapper";

const controller: Controller[] = [
  // 获取答卷列表
  {
    path: "/answer/:surveyId/list",
    method: HttpMethodEnum.GET,
    handler: async (ctx) => {
      const { surveyId } = ctx.params;
      const {} = ctx.query;

      // TODO 问卷的创建者才有权查看这个问卷的所有答卷
      const result = answerMapper.select({ surveyId: parseInt(surveyId) });

      ctx.body = AjaxResult.success({ list: result });
    },
  },
  // 提交答卷
  {
    path: "/answer/:surveyId",
    method: HttpMethodEnum.POST,
    handler: async (ctx) => {
      const { surveyId } = ctx.params;
      const { content, expendDuration } = ctx.request.body;
      const newAnswer: Answer = {
        content,
        submitTime: Date.now().toString(),
        ip: ctx.req.socket.remoteAddress,
        expendDuration,
        surveyId: parseInt(surveyId),
      };

      // TODO 问卷的创建者才有权查看这个问卷的所有答卷
      const result = answerMapper.insert(newAnswer);

      ctx.body = AjaxResult.success(result);
    },
  },
];

export default controller;
