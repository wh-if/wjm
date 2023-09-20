import BaseMapper from "./BaseMapper";
export interface Question {
  [x: string]: any;
  id?: number;
  title?: string;
  type?: string;
  content?: string;
  surveyId?: number;
  description?: string;
  required?: boolean;
  userId?: number;
  index?: number;
  
}
class QuestionMapper extends BaseMapper<Question> {
  constructor() {
    super("question");
  }
}

export const questionMapper = new QuestionMapper();
