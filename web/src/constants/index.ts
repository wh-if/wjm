// 问卷状态
export enum SurveyStatus {
  Running = 1,
  Stopping = 0
}

export enum QuestionTypeEnum {
  Radio = "radio",
  Text = "text",
  MultiRadio = "multi_radio",
}

// 题目类型
import RadioQuestion from "@/components/questions/RadioQuestion.vue";
import TextQuestion from "@/components/questions/TextQuestion.vue";
export const QuestionTypeList = [
  {
    groupTitle: "选择",
    items: {
      [QuestionTypeEnum.Radio]: {
        name: "单选",
        component: RadioQuestion
      },
      // 多选
      [QuestionTypeEnum.MultiRadio]: {
        name: "多选",
        component: RadioQuestion
      }
    } // 单选
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
