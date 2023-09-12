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
        result = await questionMapper.selectOne({ id: parseInt(id as string) });
      } else {
        result = await questionMapper.select({
          surveyId: parseInt(surveyId as string),
        });
      }
      ctx.body = AjaxResult.success({ list: result });
    },
  },
  // 新增问题
  {
    path: "/question",
    method: HttpMethodEnum.POST,
    handler: async (ctx) => {
      const { surveyId, questionType } = ctx.request.body;
      const newQuestion: Question = {
        title: "请输入题目标题",
        type: "radio",
        content: JSON.stringify({
          options: [
            { text: "选项", id: 1 },
            { text: "选项", id: 2 },
            { text: "选项", id: 3 },
            { text: "选项", id: 4 },
          ],
        }),
        index: 1,
        userId: ctx.body,
        required: false,
        surveyId: surveyId,
      };
      const questionId = await questionMapper.insert(newQuestion);
      const result = await questionMapper.selectOne({ id: questionId });
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
        content: JSON.stringify(content),
        description,
        required,
      };
      const result = await questionMapper.update(updateQuestion, { id });
      ctx.body = AjaxResult.success({ result });
    },
  },
  // 删除问题
  {
    path: "/question/:id",
    method: HttpMethodEnum.DELETE,
    handler: async (ctx) => {
      const { id } = ctx.params;
      const result = await questionMapper.remove({ id: parseInt(id) });
      ctx.body = AjaxResult.success({ result });
    },
  },
];

export default controller;
