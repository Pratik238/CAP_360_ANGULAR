export interface IExamDetails {
  sectionId?: string;
  sectionName?: string;
  calculateExamSection?: IExamSection[];
  nonCalculateExamSection?: IExamSection[];
}

export interface IExamSection {
  questionId?: string;
  questionName?: string;
  questionOptins?: IQuestionOptions[];
  answer?: string;
}

export interface IQuestionOptions {
  optionId?: string;
  optionName?: string;
}

export interface IQuestions {
  questionId?: string;
  questionName?: string;
  canUseCalculator?: boolean;
  isMultipleChoices?: boolean;
  isGridIn?: boolean;
  questionOptins?: IOptions[];
  selectedOption?: string;
  isBreakTime?: boolean;
}

export interface IOptions {
    optionId?: string;
    optionName?: string;
  selected?: boolean;
}

export interface IPracticeTest {
  ExamId?: string;
  ExamName?: string;
  QuestionId?: string;
  QuestionText?: string;
  SubjectId?: string;
  TopicId?: string;
  SubTopicId?: string;
  Option1?: string;
  Option2?: string;
  Option3?: string;
  Option4?: string;
  Answer?: string;
  Explanation?: string;
  GridId?: number;
  CalculatorId?: number;
  IsActive?: number;
  DifficultyLevelId?: number;
  TimeTaken?: string;
  SelectedAnswer?: number;
  isTakenBreak?: boolean;
}
