import { AjaxResult } from "../util/AjaxResult";
import { Controller, HttpMethodEnum } from "../model";
import { folderMapper } from "../dao/mapper/FolderMapper";
import { surveyMapper } from "../dao/mapper/SurveyMapper";

const controller: Controller[] = [
  // 获取当前用户的所有文件夹
  {
    path: "/folder",
    method: HttpMethodEnum.GET,
    handler: async (ctx) => {
      const resultList = await folderMapper.select({
        userId: ctx.body,
      });
      ctx.body = AjaxResult.success({ resultList });
    },
  },
  // 新增文件夹
  {
    path: "/folder",
    method: HttpMethodEnum.POST,
    handler: async (ctx) => {
      const { name } = ctx.request.body;
      const result = await folderMapper.insert({
        name,
        userId: ctx.body,
      });
      console.log(result + "---" + name);
      ctx.body = AjaxResult.success({ result });
    },
  },
  // 修改文件夹名称
  {
    path: "/folder/:folderId",
    method: HttpMethodEnum.PUT,
    handler: async (ctx) => {
      const folderId = ctx.params.folderId as string;
      const { name } = ctx.request.body;
      const result = await folderMapper.update(
        {
          name,
        },
        { id: parseInt(folderId) }
      );
      console.log(folderId + "---" + name);
      ctx.body = AjaxResult.success({ result });
    },
  },
  // 删除文件夹, removeSurvey是否将文件夹内的问卷移入回收站
  // TODO 文件夹删除后，更新survey的folderIds字段
  {
    path: "/folder/:folderId",
    method: HttpMethodEnum.DELETE,
    handler: async (ctx) => {
      const folderId = ctx.params.folderId as string;
      // const { removeSurvey } = ctx.request.body;
      const result = await folderMapper.remove({ id: parseInt(folderId) });

      // if (removeSurvey) {
      //   surveyMapper.update(
      //     {
      //       status: 2,
      //     },
      //     { folderId: parseInt(folderId) }
      //   );
      // }
      // console.log(folderId + "---" + removeSurvey);
      ctx.body = AjaxResult.success({ result });
    },
  },
];

export default controller;
