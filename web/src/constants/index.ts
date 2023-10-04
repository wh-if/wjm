// 问卷状态
export enum SurveyStatus {
  Running = 1,
  Stopping = 0,
  Removed = 2
}

export enum QuestionTypeEnum {
  Radio = "radio",
  Text = "text",
  MultiRadio = "multi_radio",
  File = "file",
  MultiText = "multi_text",
  DateTime = "datetime",
  Sign = "sign",
  Sort = "sort",
  MatrixRadio = "matrix_radio",
  MatrixMultiText = "matrix_multi_text",
  MatrixMultiRadio = "matrix_multi_radio",
  Star = "star"
}

// 题目类型
import RadioQuestion from "@/components/questions/RadioQuestion.vue";
import TextQuestion from "@/components/questions/TextQuestion.vue";
import CheckboxQuestion from "@/components/questions/CheckboxQuestion.vue";
import FileQuestion from "@/components/questions/FileQuestion.vue";
import MultiTextQuestion from "@/components/questions/MultiTextQuestion.vue";
import DateTimeQuestion from "@/components/questions/DateTimeQuestion.vue";
import SignQuestion from "@/components/questions/SignQuestion.vue";
import SortQuestion from "@/components/questions/SortQuestion.vue";
import MatrixRadioQuestion from "@/components/questions/MatrixRadioQuestion.vue";
import MatrixMultiRadioQuestion from "@/components/questions/MatrixMultiRadioQuestion.vue";
import MatrixMultiTextQuestion from "@/components/questions/MatrixMultiTextQuestion.vue";
import StarQuestion from "@/components/questions/StarQuestion.vue";

export const QuestionTypeList = [
  {
    groupTitle: "选择",
    items: {
      // 单选
      [QuestionTypeEnum.Radio]: {
        name: "单选",
        component: RadioQuestion
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
      },
      [QuestionTypeEnum.MultiText]: {
        name: "多项填空",
        component: MultiTextQuestion
      }
    }
  },
  {
    groupTitle: "高级题型",
    items: {
      [QuestionTypeEnum.Star]: {
        name: "量表",
        component: StarQuestion
      },
      [QuestionTypeEnum.File]: {
        name: "图片/文件",
        component: FileQuestion
      },
      [QuestionTypeEnum.DateTime]: {
        name: "日期/时间",
        component: DateTimeQuestion
      },
      [QuestionTypeEnum.Sign]: {
        name: "签名",
        component: SignQuestion
      },
      [QuestionTypeEnum.Sort]: {
        name: "排序",
        component: SortQuestion
      }
    }
  },
  {
    groupTitle: "矩阵",
    items: {
      // 矩阵单选
      [QuestionTypeEnum.MatrixRadio]: {
        name: "矩阵单选",
        component: MatrixRadioQuestion
      },
      // 矩阵多选
      [QuestionTypeEnum.MatrixMultiRadio]: {
        name: "矩阵多选",
        component: MatrixMultiRadioQuestion
      },
      // 矩阵填空
      [QuestionTypeEnum.MatrixMultiText]: {
        name: "矩阵填空",
        component: MatrixMultiTextQuestion
      }
    }
  }
];
export function getDefaultContent(type: QuestionTypeEnum) {
  const content: Record<string, any> = {};
  switch (type) {
    case QuestionTypeEnum.Radio:
    case QuestionTypeEnum.MultiRadio:
    case QuestionTypeEnum.Sort:
      content.options = [
        { text: "选项1", id: 1 },
        { text: "选项2", id: 2 },
        { text: "选项3", id: 3 },
        { text: "选项4", id: 4 }
      ];
      break;
    case QuestionTypeEnum.MultiText:
      content.textArray = [""];
      break;
    case QuestionTypeEnum.MatrixMultiRadio:
    case QuestionTypeEnum.MatrixRadio:
    case QuestionTypeEnum.MatrixMultiText:
      content.options = [
        { text: "选项1", id: 1 },
        { text: "选项2", id: 2 },
        { text: "选项3", id: 3 },
        { text: "选项4", id: 4 }
      ];
      content.series = [
        {
          id: 1,
          name: "行标题一"
        },
        {
          id: 2,
          name: "行标题二"
        }
      ];
      break;
    case QuestionTypeEnum.Star:
      (content.leftText = "左极文案"),
        (content.rightText = "右极文案"),
        (content.countLength = 5);
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
