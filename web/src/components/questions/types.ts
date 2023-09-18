export interface QuestionProps<T, G> {
  edit: boolean;
  questionContent: T;
  answerValue?: G;
}

export interface RadioContent {
  options: {
    id: number;
    text: string;
  }[];
}

export type RadioAnswer = number | number[];
