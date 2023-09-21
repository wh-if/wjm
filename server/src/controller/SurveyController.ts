import { AjaxResult } from "../util/AjaxResult";
import { Controller, HttpMethodEnum } from "../model";
import { Survey, surveyMapper } from "../dao/mapper/SurveyMapper";
import { Question, questionMapper } from "../dao/mapper/QuestionMapper";
import { collectMapper } from "../dao/mapper/CollectMapper";

const controller: Controller[] = [
  // 获取问卷列表
  {
    path: "/survey",
    method: HttpMethodEnum.GET,
    handler: async (ctx) => {
      const userId = parseInt(ctx.body);

      const {
        keyword,
        orderBy,
        desc,
        page = 1,
        pageSize = 10,
        folderId,
        status,
      } = ctx.query;
      const selectParams = {
        userId,
        folderId: parseInt(folderId as string),
        keyword: keyword as string,
        status: parseInt(status as string),
        orderBy: orderBy as "answerCount" | "createTime",
        desc: desc == undefined || desc == "true",
        page: parseInt(page as string),
        pageSize: parseInt(pageSize as string),
      };

      const { resultList, total } =
        await surveyMapper.selectListWithAnswerCount(selectParams);
      ctx.body = AjaxResult.success({ resultList, total });
    },
  },
  // 获取问卷-带问题
  {
    path: "/survey/:surveyId",
    method: HttpMethodEnum.GET,
    handler: async (ctx) => {
      const { surveyId } = ctx.params;

      const surveyResult = await surveyMapper.selectOne({
        id: parseInt(surveyId),
      });

      const questionResult = await questionMapper.select({
        surveyId: parseInt(surveyId),
      });

      // 标记已收藏的问题
      const collectResult = await collectMapper.getCollectList(ctx.body);
      collectResult.map((item) => {
        const collectQuestion = questionResult.find((i) => i.id == item.id);
        if (collectQuestion) {
          collectQuestion.stared = true;
        }
      });

      // 根据questionSort字段排序（更新questionSort字段，移除不存在的ID）
      const sortQuestionResult: Question[] = [];
      const newQuestionSort: number[] = [];
      let index = 0;
      (surveyResult.questionSort as unknown as number[]).forEach((item) => {
        const q = questionResult.find((i) => i.id == item);
        if (q) {
          sortQuestionResult[index++] = q;
          newQuestionSort.push(item);
        }
      });
      surveyResult.questionSort = newQuestionSort as unknown as string;
      surveyMapper.update(
        { questionSort: JSON.stringify(newQuestionSort) },
        { id: surveyResult.id }
      );

      ctx.body = AjaxResult.success({
        ...surveyResult,
        questions: sortQuestionResult,
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
        folderIds: JSON.stringify([]),
        questionSort: JSON.stringify([]),
        status: 0,
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
            { text: "选项1", id: 1 },
            { text: "选项2", id: 2 },
            { text: "选项3", id: 3 },
            { text: "选项4", id: 4 },
          ],
        }),
        surveyId: resultSurveyId,
        required: false,
        userId: ctx.body,
      };
      const resultQuestionId = await questionMapper.insert(question);
      surveyMapper.update(
        { questionSort: JSON.stringify([resultQuestionId]) },
        { id: resultSurveyId }
      );

      ctx.body = AjaxResult.success({ surveyId: resultSurveyId });
    },
  },
  // 修改问卷信息
  {
    path: "/survey/:surveyId",
    method: HttpMethodEnum.PUT,
    handler: async (ctx) => {
      const { title, description, viewCount, status, folderIds, questionSort } =
        ctx.request.body;

      const updateSurvey: Survey = {
        title,
        description,
        viewCount,
        status,
        folderIds: JSON.stringify(folderIds),
        questionSort: JSON.stringify(questionSort),
      };

      const result = await surveyMapper.update(updateSurvey, {
        id: parseInt(ctx.params.surveyId),
      });
      ctx.body = AjaxResult.success({ result });
    },
  },
  // 删除问卷
  {
    path: "/survey/:surveyId",
    method: HttpMethodEnum.DELETE,
    handler: async (ctx) => {
      const result = await surveyMapper.remove({
        id: parseInt(ctx.params.surveyId),
      });
      ctx.body = AjaxResult.success({ result });
    },
  },
];

export default controller;
