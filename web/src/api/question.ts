import { request } from ".";

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

export function addQuestionToSurvey(surveyId: number, questionType: string) {
  return request<Question>({
    url: "/question",
    method: "post",
    data: {
      surveyId,
      questionType
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
