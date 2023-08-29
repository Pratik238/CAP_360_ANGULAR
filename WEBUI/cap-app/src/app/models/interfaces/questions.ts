export interface IQuestions {
  questionId?: string;
  questionName?: string;
  canUseCalculator?: boolean;
  isMultipleChoices?: boolean;
  isGridIn?: boolean;
  options?: IOptions[];
  selectedOption?: string;
}

export interface IOptions {
  optionValue?: string;
  optionText?: string;
  selected?: boolean;
}
