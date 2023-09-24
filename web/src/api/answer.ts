import { request } from ".";

export interface Answer {
  id?: number;
  surveyId?: number;
  content?: any[];
  submitTime?: string;
  expendDuration?: number;
  ip?: string;

  status?: number;
  ua?: string;
}

export function getAnswerList(
  surveyId: number,
  filterData: {
    answerId?: number;
    durationRangeStart?: number;
    durationRangeEnd?: number;
    submitTimeRangeStart?: number;
    submitTimeRangeEnd?: number;
    status?: number;
    page?: number;
    pageSize?: number;
  }
) {
  return request({
    url: `/answer/${surveyId}/list`,
    method: "get",
    params: filterData
  });
}

export function getAnswerById(answerId: number) {
  return request({
    url: `/answer/${answerId}`,
    method: "get"
  });
}

export function updateAnswerData(answerId: number, updateData: Answer) {
  return request({
    url: `/answer/${answerId}`,
    method: "put",
    data: updateData
  });
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
