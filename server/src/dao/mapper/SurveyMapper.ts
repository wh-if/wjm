import BaseMapper from "./BaseMapper";
export interface Survey {
  id?: string;
  title?: string;
  userId?: string;
  description?: string;
  status?: string;
  qrCode?: string;
  linkUrl?: string;
  createTime?: string;
  updateTime?: string;
}

type SelectListParams = {
  keyword: string;
  orderBy: "answerCount" | "createTime";
  desc: boolean;
};

class SurveyMapper extends BaseMapper<Survey> {
  constructor() {
    super("survey");
  }
  selectListWithAnswerCount(
    userId: number,
    keyword: string,
    orderBy: "answerCount" | "createTime" = "createTime",
    desc: boolean = true
  ) {
    return new Promise((resolve, reject) => {
      const sql = `SELECT *, (SELECT COUNT(1) from answer where answer.surveyId=survey.id) as answerCount FROM survey where userId=${userId} and survey.title like ${this.POOL.escape(
        "%" + keyword + "%"
      )} order by ${orderBy} ${desc ? "desc" : ""}`;
      // console.log(sql);

      this.POOL.query(sql, (error, results, fields) => {
        // console.log(results);
        resolve(results);
      });
    });
  }
}

export const surveyMapper = new SurveyMapper();
