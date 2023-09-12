import BaseMapper from "./BaseMapper";
export interface Answer {
  id?: number;
  surveyId?: number;
  content?: string;
  submitTime?: string;
  expendDuration?: number;
  ip?: string;
}
class AnswerMapper extends BaseMapper<Answer> {
  constructor() {
    super("answer");
  }
}

export const answerMapper = new AnswerMapper();
