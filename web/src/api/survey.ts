import { request } from ".";

type SearchSurveyParams = {
  keyword: string;
  orderBy: "answerCount" | "createTime";
  desc?: boolean;
};

export interface Question {
  id: number;
  title: string;
  type: string;
  content: Record<string, any>;
  surveyId: number;
  description: string;
  required: boolean;
  userId: number;
  index: number;
}

export type SurveyWithQuestions = {
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
};

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
  return request({
    url: "/survey/" + surveyId,
    method: "get"
  });
}
