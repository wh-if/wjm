import BaseMapper from "./BaseMapper";
import { Question } from "./QuestionMapper";
export interface Collect {
  id?: number;
  questionId?: number;
  userId?: number;
}
class CollectMapper extends BaseMapper<Collect> {
  constructor() {
    super("collect");
  }
  // 10000000为公共题库
  getCollectList(userId: number) {
    if (!userId) {
      userId = 10000000;
    }
    let sql = `select question.* from question,collect where collect.userId=${userId} and collect.questionId=question.id`;
    return this.selectBySql<Question[]>(sql);
  }
}

export const collectMapper = new CollectMapper();
