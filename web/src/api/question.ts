import type { QuestionTypeEnum } from "@/constants";
import { request } from ".";

export interface Question {
  id: number;
  title: string;
  type: QuestionTypeEnum;
  content: Record<string, any>;
  surveyId: number;
  description: string;
  required: boolean;
  userId: number;
  index: number;
}

export function addQuestionToSurvey(
  surveyId: number,
  questionType: QuestionTypeEnum,
  content: Record<string, any>
) {
  return request<Question>({
    url: "/question",
    method: "post",
    data: {
      surveyId,
      questionType,
      content
    }
  });
}
export function updateQuestion(data: Question) {
  return request({
    url: "/question",
    method: "put",
    data
  });
}
