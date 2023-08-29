export interface IAdminExam {
  _id?: string;
  userName?: string;
  totalNumberOfQuestions?: number;
  breakTime?: number;
  startTime?: number;
  totalNonCalcMultipleChoiceQuestions?: number;
  totalNonCalcGridInQuestions?: number;
  totalNumberOfNonCalcQuestions?: number;
  nonCalcQuestionsTime?: number;

  totalCalcMultipleChoiceQuestions?: number;
  totalCalcGridInQuestions?: number;
  totalNumberOfCalcQuestions?: number;
  calcQuestionsTime?: number;

  completeionTime?: number;

  numberOfRightAnswersInNonCalcMultipleChoiceQs?: number;
  numberOfRightAnswersInNonCalcGridInQs?: number;
  numberOfRightAnswersInCalcMultipleQs?: number;
  numberOfRightAnswersInCalcGridInQs?: number;

  numberOfWrongAnswersInNonCalcMultipleChoiceQustns?: number;
  numberOfWrongAnswersInNonCalcGridInQs?: number;
  numberOfWrongAnswersInCalcMultipleQs?: number;
  numberOfWrongAnswersInCalcGridInQs?: number;

  numberOfAnsweredQs?: number;
  numberOfSkippedQs?: number;
  numberOfUnansweredQs?: number;
  numberOfWrongQuestions?: number;
  numberOfRightAnswers?: number;
  examTaken?: boolean;
  examEndByUser?: boolean;
  examEndBySystem?: boolean;

  status?: string;
  createdBy?: string;
  updatedBy?: string;
  createdDt?: string;
  updatedDt?: string;
}

export interface IAdminExamSubTopics extends IAdminExam {
  examId?: string;
  topicName?: string;
  topicId?: string;
  subTopicName?: string;
  subTopicId?: string;
}

export interface IAdminExamQuestion {
  examId?: string;
  examSubTopicId?: string;
  userName?: string;
  questionId?: string;
  question?: string;
  topicName?: string;
  subTopicName?: string;
  difficultyLevel?: number;
  canUseCalculator?: boolean;
  isMultipleChoice?: boolean;
  isGridIn?: boolean;
  selectedOption?: number;
  timeTaken?: number;
  skipped?: boolean;
  isAnswered?: boolean;
  score?: string;
  status?: string;
  createdBy?: string;
  updatedBy?: string;
  createdDt?: string;
  updatedDt?: string;
  _id?: string;
}

export interface IAdminIssueReport {
  _id?: string;
  examId?: string;
  userId?: string;
  issueReportedDt?: string;
  issueStatus?: string;
  issueDescription?: string;
  examSubTopicId?: string;
  userName?: string;
  questionId?: string;
  question?: string;
  questionExaplanation?: string;
  topicName?: string;
  subTopicName?: string;
  difficultyLevel?: number;
  canUseCalculator?: boolean;
  isMultipleChoice?: boolean;
  isGridIn?: boolean;
  selectedOption?: number;
  questionStatus?: string;
  createdBy?: string;
  updatedBy?: string;
  createdDt?: string;
  updatedDt?: string;
  options?: IAdminIssueQuestionOptions[];
}

export interface IAdminIssueQuestionOptions {
  id?: string;
  value?: string;
  selectedAnswer?: boolean;
}

export interface IAdminQuestion {
  TopicId?: string;
  TopicName?: string;
  SubTopicId?: string;
  SubTopicName?: string;
  CalculatorId?: number;
  isMultipleChoice?: boolean;
  GridId?: string;
  QuestionId?: number;
  QuestionText?: string;
  Option1?: string;
  Option2?: string;
  Option3?: string;
  Option4?: string;
  Answer?: string;
  Explanation?: string;
  GridName?: string;
  DifficultyLevelName?: string;
  DifficultyLevelId?: number;
  IsActive?: number;
  _id?: string;
  Createdby?: string;
  Updatedby?: string;
  CreatedDate?: string;
  UpdatedDate?: string;
}
