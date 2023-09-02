import { AjaxResult } from "../util/AjaxResult";
import { Controller, HttpMethodEnum } from "../model";
import { Survey, surveyMapper } from "../dao/mapper/SurveyMapper";

const controller: Controller[] = [
  // 获取问卷列表
  {
    path: "/survey",
    method: HttpMethodEnum.GET,
    handler: async (ctx) => {
      const id = parseInt(ctx.body);

      const { keyword, orderBy, desc } = ctx.query;      

      const result = await surveyMapper.selectListWithAnswerCount(
        id,
        keyword as string,
        orderBy as "answerCount" | "createTime",
        desc == undefined || desc == "true"
      );
      ctx.body = AjaxResult.success(result);
    },
  },
  // 添加问卷
  {
    path: '/survey',
    method: HttpMethodEnum.POST,
    handler: async (ctx) => {
      const { title } = ctx.request.body;
      const currentTime = Date.now().toString();

      const newSurvey: Survey = {
        title,
        createTime: currentTime,
        updateTime: currentTime,
        status: '0',
        userId: ctx.body
      };
      const result = surveyMapper.insert(newSurvey);
      ctx.body = AjaxResult.success(result);
    }
  },
  // 修改问卷信息
  {
    path: '/survey/:surveyId',
    method: HttpMethodEnum.PUT,
    handler: async (ctx) => {
      const result = await surveyMapper.update(ctx.request.body, {
        id: ctx.params.surveyId,
      });

      if (result) {
        ctx.body = AjaxResult.success();
      } else {
        ctx.body = AjaxResult.error();
      }
    }
  }
];

export default controller;
