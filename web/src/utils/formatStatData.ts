import type { Answer } from "@/api/answer";
import type { Question } from "@/api/question";
import type { SurveyWithQuestions } from "@/api/survey";
import { QuestionTypeEnum } from "@/constants";
import { toRaw } from "vue";

type StatRawData = {
  survey: SurveyWithQuestions;
  answerList: Answer[];
};

export function formatStatData(statRawData: StatRawData) {
  statRawData = toRaw(statRawData);
  const formatStatResult: FormatStatResult[] = [];
  statRawData?.survey.questions?.forEach((questionItem) => {
    // 筛选出该问题的所有答卷
    const resultList = filterResultList(statRawData, questionItem);
    // 填写率
    const answerRate = computeAnswerRate(statRawData, resultList);

    const formatStatResultItem: FormatStatResult = {
      // 题目ID
      questionRaw: questionItem,
      // 答卷数据列表
      answerResultList: resultList,
      // 填写率
      answerRate
    };

    switch (questionItem.type) {
      case QuestionTypeEnum.Radio:
      case QuestionTypeEnum.MultiRadio:
        handleRadio(formatStatResultItem);
        break;
      case QuestionTypeEnum.MultiText:
        handleMultiText(formatStatResultItem);
        break;
      case QuestionTypeEnum.Sort:
        handleSort(formatStatResultItem);
        break;
      case QuestionTypeEnum.MatrixRadio:
      case QuestionTypeEnum.MatrixMultiRadio:
        handleMatrixRadio(formatStatResultItem);
        break;
      case QuestionTypeEnum.MatrixMultiText:
        handleMatrixText(formatStatResultItem);
        break;
      default:
        break;
    }
    formatStatResult.push(formatStatResultItem);
  });
  console.log(formatStatResult);
  return formatStatResult;
}
// 筛选出该问题的所有答卷
function filterResultList(
  statRawData: StatRawData,
  questionItem: Question
): any[] {
  const resultList: ResultList = [];
  statRawData.answerList.forEach((answerItem) => {
    answerItem.content?.find((answerQuestionItem) => {
      if (answerQuestionItem == null) {
        return false;
      }
      if (answerQuestionItem.questionId == questionItem.id) {
        resultList.push({
          answerId: answerItem.id!,
          resultValue: answerQuestionItem.resultValue
        });
        return true;
      } else {
        return false;
      }
    });
  });
  return resultList;
}
// 填写率
function computeAnswerRate(statRawData: StatRawData, resultList: ResultList) {
  const rate: number =
    (resultList.length * 100) / statRawData.answerList.length;
  return isNaN(rate) ? "0" : rate.toFixed(2);
}
// 处理选择题
function handleRadio(formatStatResultItem: FormatStatResult) {
  // 统计各选项数据
  const resultOptions: any[] = [];
  formatStatResultItem.questionRaw.content!.options?.forEach(
    (optionItem: RadioOptionFormatStatResult) => {
      // 选该选项的个数
      optionItem.count = 0;
      // flat 兼容多选
      formatStatResultItem.answerResultList
        .map((s) => s.resultValue)
        .flat(2)
        .forEach((item) => {
          if (item == optionItem.id) {
            optionItem.count!++;
          }
        });
      // 选项选择率
      optionItem.rate = parseFloat(
        (
          optionItem.count / formatStatResultItem.answerResultList.length
        ).toFixed(2)
      );
      if (isNaN(optionItem.rate)) optionItem.rate = 0;
      resultOptions.push(optionItem);
    }
  );
  formatStatResultItem.options = resultOptions;
}
// 处理多项填空
function handleMultiText(formatStatResultItem: FormatStatResult) {
  const arr = formatStatResultItem.questionRaw.content!.textArray.filter(
    (it: any) => typeof it == "number"
  );
  formatStatResultItem.answerResultList.forEach((item) => {
    item.resultValue = arr.map((it: any) => item.resultValue[it]).join("；");
  });
}

// 处理排序
function handleSort(formatStatResultItem: FormatStatResult) {
  formatStatResultItem.answerResultList.forEach((item) => {
    item.resultValue = item.resultValue.join("，");
  });
}

// 处理矩阵单选\多选
function handleMatrixRadio(formatStatResultItem: FormatStatResult) {
  const resultSeries = [] as any;

  formatStatResultItem.questionRaw.content!.series.forEach(
    (seriesItem: any) => {
      const newSeriesItem = Object.assign({}, seriesItem);
      newSeriesItem.options = [];
      formatStatResultItem.questionRaw.content!.options?.forEach(
        (optionItem: RadioOptionFormatStatResult) => {
          const newOptionItem = Object.assign({}, optionItem);
          // 选该选项的个数
          newOptionItem.count = 0;
          formatStatResultItem.answerResultList
            .map((s) => s.resultValue)
            .forEach((item) => {
              // 单选 || 多选
              if (
                item[seriesItem.id] == optionItem.id ||
                item[seriesItem.id][optionItem.id]
              ) {
                newOptionItem.count!++;
              }
            });
          // 选项选择率
          newOptionItem.rate = parseFloat(
            (
              newOptionItem.count / formatStatResultItem.answerResultList.length
            ).toFixed(2)
          );
          if (isNaN(newOptionItem.rate)) newOptionItem.rate = 0;
          newSeriesItem.options.push(newOptionItem);
        }
      );
      resultSeries.push(newSeriesItem);
    }
  );
  formatStatResultItem.seriesStat = resultSeries;
}

// 处理矩阵填空
function handleMatrixText(formatStatResultItem: FormatStatResult) {
  formatStatResultItem.answerResultList.forEach((item) => {
    formatStatResultItem.questionRaw.content!.series.forEach(
      (seriesItem: any) => {
        const element = item.resultValue[seriesItem.id];
        const optionsResult =
          formatStatResultItem.questionRaw.content!.options.map(
            (optionItem: any) => element[optionItem.id]
          );
        item.resultValue[seriesItem.id] = optionsResult.join("，");
      }
    );
  });
}

export interface FormatStatResult {
  // 题目源数据
  questionRaw: Question;

  // 答卷数据列表
  answerResultList: ResultList;

  // 填写率
  answerRate: string;
  // 各选项数据(选择题)
  options?: RadioOptionFormatStatResult[];
  seriesStat?: {
    id: number;
    name: string;
    options: RadioOptionFormatStatResult[];
  }[];
}

interface RadioOptionFormatStatResult {
  id: number;
  text: string;
  count: number;
  rate: number;
}

type ResultList = {
  [x: string]: any;
  answerId: number;
  resultValue: any;
}[];
