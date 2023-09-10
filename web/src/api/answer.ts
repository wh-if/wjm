import { request } from ".";

export interface Answer {
  id?: number;
  surveyId?: number;
  content?: string;
  submitTime?: string;
  expendDuration?: string;
  ip?: string;
}

export function addAnswer(
  surveyId: number,
  content: Record<string, any>[],
  expendDuration: number
) {
  return request({
    url: "/answer/" + surveyId,
    method: "post",
    data: {
      content,
      expendDuration
    }
  });
}
