import { request } from ".";
export interface Collect {
  id?: number;
  questionId?: number;
  userId?: number;
}

export function getCollectList(isPublic: boolean) {
  return request({
    url: "/collect",
    method: "get",
    params: {
      isPublic
    }
  });
}
export function addCollect(questionId: number) {
  return request({
    url: "/collect",
    method: "post",
    data: {
      questionId
    }
  });
}
export function removeCollect(questionId: number) {
  return request({
    url: "/collect",
    method: "delete",
    params: {
      questionId
    }
  });
}
