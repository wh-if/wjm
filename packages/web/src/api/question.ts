import type { QuestionTypeEnum } from "@/constants";
import { request } from ".";

export interface Question<T = Record<string, any>> {
  [x: string]: any;
  id?: number;
  title?: string;
  type?: QuestionTypeEnum;
  content?: T;
  surveyId?: number;
  description?: string;
  required?: boolean;
  userId?: number;
}

export function addQuestionToSurvey(question: Question) {
  return request({
    url: "/question",
    method: "post",
    data: question
  });
}
export function updateQuestion(data: Question) {
  return request({
    url: "/question",
    method: "put",
    data
  });
}
export function removeQuestion(questionId: number) {
  return request({
    url: "/question/" + questionId,
    method: "delete"
  });
}
