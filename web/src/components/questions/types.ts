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
export type TextContent = string;
export type TextAnswer = string;
// 多选
export type CheckboxContent = RadioContent;
export type CheckboxAnswer = number[];
