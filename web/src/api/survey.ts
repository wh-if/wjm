import type { SurveyStatus } from "@/constants";
import { request } from ".";
import type { Question } from "./question";

export type SearchSurveyParams = {
  keyword?: string;
  status?: number;
  orderBy?: "answerCount" | "createTime";
  desc?: boolean;
  page?: number;
  pageSize?: number;
  folderId?: number;
};

export interface SurveyWithQuestions {
  id?: number;
  title?: string;
  status?: SurveyStatus;
  createTime?: string;
  updateTime?: string;
  folderIds?: number[];
  questionSort?: number[];
  description?: string;
  userId?: number;
  endOfSurvey?: string;
  viewCount?: number;
  questions?: Question[];
}

export function getSurveyList(params: SearchSurveyParams) {
  return request({
    url: "/survey",
    method: "get",
    params
  });
}

export function createNewSurvey() {
  return request({
    url: "/survey",
    method: "post"
  });
}

export function getSurveyWithQuestions(surveyId: number | string) {
  return request<SurveyWithQuestions>({
    url: "/survey/" + surveyId,
    method: "get"
  });
}

export function updateSurvey(data: SurveyWithQuestions) {
  return request({
    url: "/survey/" + data.id,
    method: "put",
    data
  });
}

export function removeSurvey(surveyIds: number[]) {
  return request({
    url: "/survey",
    method: "delete",
    params: {
      ids: JSON.stringify(surveyIds)
    }
  });
}
