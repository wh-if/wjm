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
      const {
        durationRangeStart,
        durationRangeEnd,
        submitTimeRangeStart,
        submitTimeRangeEnd,
        status,
        page,
        pageSize,
      } = ctx.query;
      let searchObj = {
        surveyId: parseInt(surveyId),
        durationRangeStart: durationRangeStart as string,
        durationRangeEnd: durationRangeEnd as string,
        submitTimeRangeStart: submitTimeRangeStart as string,
        submitTimeRangeEnd: submitTimeRangeEnd as string,
        status: status as string,
      };
      // TODO 问卷的创建者才有权查看这个问卷的所有答卷
      const listTotal = await answerMapper.selectAnswerList(true, searchObj);
      const result = await answerMapper.selectAnswerList(false, {
        ...searchObj,
        page: parseInt(page as string),
        pageSize: parseInt(pageSize as string),
      });

      ctx.body = AjaxResult.success({ list: result, total: listTotal });
    },
  },
  {
    path: "/answer/:answerId",
    method: HttpMethodEnum.GET,
    handler: async (ctx) => {
      const { answerId } = ctx.params;
      const result = await answerMapper.selectOne({
        id: parseInt(answerId),
      });

      ctx.body = AjaxResult.success(result);
    },
  },
  // 修改
  {
    path: "/answer/:answerId",
    method: HttpMethodEnum.PUT,
    handler: async (ctx) => {
      const { answerId } = ctx.params;
      const result = await answerMapper.update(ctx.request.body, {
        id: parseInt(answerId),
      });

      ctx.body = AjaxResult.success({ result });
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
        content: JSON.stringify(content),
        submitTime: Date.now().toString(),
        ip: ctx.req.socket.remoteAddress,
        expendDuration,
        surveyId: parseInt(surveyId),
        ua: ctx.request.headers["user-agent"],
      };

      // TODO 问卷的创建者才有权查看这个问卷的所有答卷
      const result = await answerMapper.insert(newAnswer);

      ctx.body = AjaxResult.success({ result });
    },
  },
];

export default controller;
