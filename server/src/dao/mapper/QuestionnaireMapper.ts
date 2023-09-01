import BaseMapper from "./BaseMapper";
export interface Questionnaire {
  id?: string;
  title?: string;
  email?: string;
  password?: string;
  status?: string;
  qrCode?: string;
  linkUrl?: string;
  createTime?: string;
  updateTime?: string;
}
class QuestionnaireMapper extends BaseMapper<Questionnaire> {
  constructor() {
    super("questionnaire");
  }
  selectListWithAnswerCount(userId: number) {
    return new Promise((resolve, reject) => {      
      this.POOL.query(
        `SELECT *, (SELECT COUNT(1) from answer_sheet where answer_sheet.questionnaireId=id) as answerCount FROM questionnaire where userId=${userId}`,
        (error, results, fields) => {
          // console.log(results);
          resolve(results);
        }
      );
    });
  }
}

export const questionnaireMapper = new QuestionnaireMapper();
