import { request } from ".";

export function getQuestionnaireList() {
  return request({
    url: "/questionnaire",
    method: "get",
  });
}