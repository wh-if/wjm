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
    desc: boolean = true,
    page: number = 1,
    pageSize: number = 10
  ) {
    const sql = `SELECT *, (SELECT COUNT(1) from answer where answer.surveyId=survey.id) as answerCount FROM survey where userId=${userId} and survey.title like ${this.POOL.escape(
      "%" + keyword + "%"
    )} order by ${orderBy} ${desc ? "desc" : ""} limit ${
      (page - 1) * pageSize
    },${pageSize}`;
    return this.selectBySql(sql);
  }

  // 问卷总数量计数
  async selectTotalCount(userId: number, keyword: string) {
    const sql = `SELECT count(*) FROM survey where userId=${userId} and survey.title like ${this.POOL.escape(
      "%" + keyword + "%"
    )}`;
    return this.selectBySql<number>(sql);
  }
}

export const surveyMapper = new SurveyMapper();
