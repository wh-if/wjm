import { AjaxResult } from "../util/AjaxResult";
import { Controller, HttpMethodEnum } from "../model";
import { Survey, surveyMapper } from "../dao/mapper/SurveyMapper";
import { Question, questionMapper } from "../dao/mapper/QuestionMapper";

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
      ctx.body = AjaxResult.success({ list: result });
    },
  },
  // 获取问卷-带问题
  {
    path: "/survey/:surveyId",
    method: HttpMethodEnum.GET,
    handler: async (ctx) => {
      const { surveyId } = ctx.params;

      const surveyResult = await surveyMapper.selectOne({ id: parseInt(surveyId) });

      const questionResult = await questionMapper.select({
        surveyId: parseInt(surveyId),
      });      

      ctx.body = AjaxResult.success({
        ...surveyResult,
        quesitons: questionResult,
      });
    },
  },
  // 添加问卷
  {
    path: "/survey",
    method: HttpMethodEnum.POST,
    handler: async (ctx) => {
      const currentTime = Date.now().toString();

      const newSurvey: Survey = {
        title: "问卷标题",
        createTime: currentTime,
        updateTime: currentTime,
        status: "0",
        userId: ctx.body,
        description:
          "为了给您提供更好的服务，希望您能抽出几分钟时间，将您的感受和建议告诉我们，我们非常重视每位用户的宝贵意见，期待您的参与！现在我们就马上开始吧!",
      };
      const resultSurveyId = await surveyMapper.insert(newSurvey);

      // 一个自带的题目
      const question: Question = {
        title: "请输入题目标题",
        type: "radio",
        content: JSON.stringify({
          options: [
            { text: "选项", id: 1 },
            { text: "选项", id: 1 },
            { text: "选项", id: 1 },
            { text: "选项", id: 1 },
          ],
        }),
        index: 1,
        surveyId: resultSurveyId,
        required: false,
        userId: ctx.body,
      };
      questionMapper.insert(question);

      ctx.body = AjaxResult.success({ surveyId: resultSurveyId });
    },
  },
  // 修改问卷信息
  {
    path: "/survey/:surveyId",
    method: HttpMethodEnum.PUT,
    handler: async (ctx) => {
      const result = await surveyMapper.update(ctx.request.body, {
        id: parseInt(ctx.params.surveyId),
      });

      if (result) {
        ctx.body = AjaxResult.success();
      } else {
        ctx.body = AjaxResult.error();
      }
    },
  },
];

export default controller;
