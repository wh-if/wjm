import BaseMapper from "./BaseMapper";
export interface Survey {
  id?: number;
  title?: string;
  userId?: number;
  description?: string;
  status?: string;
  qrCode?: string;
  linkUrl?: string;
  createTime?: string;
  updateTime?: string;
  viewCount?: number;
}

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
    const sql = `SELECT *, (SELECT COUNT(1) from answer where answer.surveyId=survey.id) as answerCount FROM survey where userId=${userId} and survey.title like ${this.POOL.escape(
      "%" + keyword + "%"
    )} order by ${orderBy} ${desc ? "desc" : ""}`;
    return this.selectBySql(sql);
  }
}

export const surveyMapper = new SurveyMapper();
