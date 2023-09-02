import BaseMapper from "./BaseMapper";
export interface Question {
  id?: string;
  title?: string;
  type?: string;
  content?: string;
  surveyId?: string;
  description?: string;
  required?: string;
  userId?: string;
  
}
class QuestionMapper extends BaseMapper<Question> {
  constructor() {
    super("question");
  }
}

export const questionMapper = new QuestionMapper();
