import BaseMapper from "./BaseMapper";
export interface Answer {
  id?: number;
  surveyId?: number;
  content?: string;
  submitTime?: string;
  expendDuration?: number;
  ip?: string;

  status?: number;
  ua?: string;
}
class AnswerMapper extends BaseMapper<Answer> {
  constructor() {
    super("answer");
  }

  selectAnswerList(
    selectTotalCount: boolean,
    options: {
      surveyId: number;
      durationRangeStart?: string;
      durationRangeEnd?: string;
      submitTimeRangeStart?: string;
      submitTimeRangeEnd?: string;
      status?: string;
      page?: number;
      pageSize?: number;
    }
  ) {
    const {
      surveyId,
      durationRangeStart,
      durationRangeEnd,
      submitTimeRangeStart,
      submitTimeRangeEnd,
      status,
      page,
      pageSize,
    } = options;
    let sql = this.warpWhere(
      `select ${selectTotalCount ? "count(*)" : "*"} from answer`,
      { surveyId, status }
    );
    if (durationRangeStart) {
      sql += ` and expendDuration>${durationRangeStart}`;
    }
    if (durationRangeEnd) {
      sql += ` and expendDuration<${durationRangeEnd}`;
    }
    if (submitTimeRangeStart) {
      sql += ` and submitTime>${submitTimeRangeStart}`;
    }
    if (submitTimeRangeEnd) {
      sql += ` and submitTime<${submitTimeRangeEnd}`;
    }
    if (selectTotalCount) {
      return this.selectBySql<number>(sql);
    }
    if (isNaN(page) || isNaN(pageSize)) {
      return this.selectBySql(sql);
    } else {
      sql += ` limit ${(page - 1) * pageSize},${pageSize}`;
      return this.selectBySql(sql);
    }
  }
}

export const answerMapper = new AnswerMapper();
