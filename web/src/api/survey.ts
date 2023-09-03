import { request } from ".";

type SearchSurveyParams = {
  keyword: string,
  orderBy: "answerCount" | "createTime",
  desc?: boolean 
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
    method: "post",
  });
}