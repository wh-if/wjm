import BaseMapper from "./BaseMapper";
export interface Survey {
  id?: number;
  title?: string;
  userId?: number;
  description?: string;
  status?: number;
  questionSort?: string; // questionId[]
  folderIds?: string; // number[]
  createTime?: string;
  updateTime?: string;
  viewCount?: number;
}

class SurveyMapper extends BaseMapper<Survey> {
  constructor() {
    super("survey");
  }
  async selectListWithAnswerCount(
    options: {
      userId: number;
      folderId: number;
      keyword?: string;
      status: number;
      orderBy?: "answerCount" | "createTime";
      desc?: boolean;
      page?: number;
      pageSize?: number;
    },
    noPage: boolean = false
  ) {
    const {
      userId,
      folderId,
      keyword = "",
      status,
      orderBy = "createTime",
      desc = true,
      page = 1,
      pageSize = 10,
    } = options;
    let sql = `SELECT *, (SELECT COUNT(1) from answer where answer.surveyId=survey.id) as answerCount`;
    const sqlOfCommon = ` FROM survey where userId=${userId} and status${
      isNaN(status) ? "!=2" : "=" + status
    } ${
      isNaN(folderId)
        ? ""
        : " and folderIds like " + this.POOL.escape("%" + folderId + "%")
    } and (survey.id like ${this.POOL.escape(
      "%" + keyword + "%"
    )} or survey.title like ${this.POOL.escape("%" + keyword + "%")})`;
    const total = await this.selectBySql<number>(
      "SELECT count(*)" + sqlOfCommon
    );
    sql += sqlOfCommon;
    sql += ` order by ${orderBy} ${desc ? "desc" : ""}`;
    if (!noPage) {
      sql += ` limit ${(page - 1) * pageSize},${pageSize}`;
    }
    const resultList = await this.selectBySql(sql);
    return {
      total,
      resultList,
    };
  }
}

export const surveyMapper = new SurveyMapper();
