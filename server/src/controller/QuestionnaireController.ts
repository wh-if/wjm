import { AjaxResult } from "../util/AjaxResult";
import { Controller, HttpMethodEnum } from "../model";
import { questionnaireMapper } from "../dao/mapper/QuestionnaireMapper";
import Jwt from "jsonwebtoken"

const controller: Controller[] = [
  // 获取问卷列表
  {
    path: "/questionnaire",
    method: HttpMethodEnum.GET,
    handler: async (ctx) => {

      const {id} = Jwt.decode(ctx.headers.token as string) as Record<string,any>;

      const result = await questionnaireMapper.selectListWithAnswerCount(
        id
      );
      ctx.body = AjaxResult.success(result);
    },
  },
];

export default controller;
