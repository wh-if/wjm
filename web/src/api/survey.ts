import { request } from ".";
import type { Question } from "./question";

type SearchSurveyParams = {
  keyword: string;
  orderBy: "answerCount" | "createTime";
  desc?: boolean;
};

export interface SurveyWithQuestions {
  id: number;
  title: string;
  status: number;
  createTime: string;
  updateTime: string;
  linkUrl: string;
  qrCode: string;
  description: string;
  userId: number;
  endOfSurvey: string;
  quesitons: Question[];
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
