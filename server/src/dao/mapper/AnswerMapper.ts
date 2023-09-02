import BaseMapper from "./BaseMapper";
export interface Answer {
  id?: string;
  surveyId?: string;
  content?: string;
  submitTime?: string;
  expendDuration?: string;
  ip?: string;
}
class AnswerMapper extends BaseMapper<Answer> {
  constructor() {
    super("answer");
  }
}

export const answerMapper = new AnswerMapper();
