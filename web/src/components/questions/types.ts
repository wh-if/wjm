export interface QuestionProps<QUESTION_CONTENT, ANSWER_VALUE> {
  edit: boolean;
  questionContent: QUESTION_CONTENT;
  answerValue?: ANSWER_VALUE;
  disabled: boolean;
}
// 单选
export interface RadioContent {
  options: {
    id: number;
    text: string;
  }[];
}
export type RadioAnswer = number;
// 文本
export type TextContent = {};
export type TextAnswer = string;
// 多选
export type CheckboxContent = RadioContent;
export type CheckboxAnswer = number[];
// 图片/文件
export type FileContent = {};
export type FileAnswer = {
  filename: string;
  mimetype: string;
  fileKey: string;
}[];
// 多项填空
export type MultiTextContent = {
  textArray: (string | number)[];
};
export type MultiTextAnswer = {
  [x: number]: string;
};

// 日期/时间
export type DateTimeContent = {};
export type DateTimeAnswer = string;
// 签名
export type SignContent = {};
export type SignAnswer = string;
// 排序
export type SortContent = RadioContent;
export type SortAnswer = number[];

// 矩阵单选
export type MatrixRadioContent = {
  options: {
    id: number;
    text: string;
  }[];
  // 维度
  series: {
    id: number;
    name: string;
  }[];
};
export type MatrixRadioAnswer = Record<string, number>;

// 矩阵多选
export type MatrixMultiRadioContent = MatrixRadioContent;
export type MatrixMultiRadioAnswer = Record<string, Record<number, boolean>>;

// 矩阵填空
export type MatrixMultiTextContent = MatrixRadioContent;
export type MatrixMultiTextAnswer = {
  [x: string]: Record<number, string>;
};

// 量表
export type StarContent = {
  // 两极文案
  leftText: string;
  rightText: string;
  countLength: number; // 量表维度
};
export type StarAnswer = number;
