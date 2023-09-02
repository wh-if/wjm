import { AjaxResult } from "../util/AjaxResult";
import { Controller, HttpMethodEnum } from "../model";
import { Question, questionMapper } from "../dao/mapper/QuestionMapper";

const controller: Controller[] = [
  // 获取问题列表
  {
    path: "/question",
    method: HttpMethodEnum.GET,
    handler: async (ctx) => {
      const { id, surveyId } = ctx.query;
      let result: any;
      if (id) {
        result = questionMapper.selectOne({ id: id as string });
      } else {
        result = questionMapper.select({ surveyId: surveyId as string });
      }
      ctx.body = AjaxResult.success(result);
    },
  },
  // 新增问题
  {
    path: "/question",
    method: HttpMethodEnum.POST,
    handler: async (ctx) => {
      const { title, type, content, surveyId, description, required } =
        ctx.request.body;
      const newQuestion: Question = {
        title,
        type,
        content,
        surveyId,
        description,
        required,
        userId: ctx.body,
      };
      const result = questionMapper.insert(newQuestion);
      ctx.body = AjaxResult.success(result);
    },
  },
  // 修改问题
  {
    path: "/question",
    method: HttpMethodEnum.PUT,
    handler: async (ctx) => {
      const { id, title, type, content, description, required } =
        ctx.request.body;
      const updateQuestion: Question = {
        title,
        type,
        content,
        description,
        required,
      };
      const result = questionMapper.update(updateQuestion, { id });
      ctx.body = AjaxResult.success(result);
    },
  },
  // 删除问题
  {
    path: "/question/:id",
    method: HttpMethodEnum.DELETE,
    handler: async (ctx) => {
      const { id } = ctx.params;
      const result = questionMapper.remove({ id });
      ctx.body = AjaxResult.success(result);
    },
  },
];

export default controller;
