// 问卷状态
export enum SurveyStatus {
  Running = 1,
  Stopping = 0,
  Removed = 2
}

export enum QuestionTypeEnum {
  Radio = "radio",
  Text = "text",
  MultiRadio = "multi_radio"
}

// 题目类型
import RadioQuestion from "@/components/questions/RadioQuestion.vue";
import TextQuestion from "@/components/questions/TextQuestion.vue";
import CheckboxQuestion from "@/components/questions/CheckboxQuestion.vue";
export const QuestionTypeList = [
  {
    groupTitle: "选择",
    items: {
      // 单选
      [QuestionTypeEnum.Radio]: {
        name: "单选",
        component: RadioQuestion,
      },
      // 多选
      [QuestionTypeEnum.MultiRadio]: {
        name: "多选",
        component: CheckboxQuestion
      }
    }
  },
  {
    groupTitle: "文本输入",
    items: {
      // 文本
      [QuestionTypeEnum.Text]: {
        name: "单行文本",
        component: TextQuestion
      }
    }
  }
];
export function getDefaultContent(type: QuestionTypeEnum) {
  const content: Record<string, any> = {};
  switch (type) {
    case QuestionTypeEnum.Radio:
    case QuestionTypeEnum.MultiRadio:
      content.options = [
        { text: "选项1", id: 1 },
        { text: "选项2", id: 2 },
        { text: "选项3", id: 3 },
        { text: "选项4", id: 4 },
      ];
      break;
    default:
      break;
  }
  return content;
}

export const QuestionTypeObj: Partial<
  Record<QuestionTypeEnum, { name: string; component: any }>
> = {};
QuestionTypeList.forEach((item) => Object.assign(QuestionTypeObj, item.items));