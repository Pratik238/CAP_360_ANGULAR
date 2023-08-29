export interface IAddExam {
  Id?: number;
  ExamId?: number;
  StudentId?: number;
  QuestionId?: number;
  SelectedAnswer?: number;
  Skipped?: number;
  Answered?: number;
  Startdate?: string;
  EndDate?: string;
  UnAnswered?: number;
  FranchiseId?: number;
}

export interface IAddExamId {
  ExamId?: number;
  StudentId?: number;
  TestId?: number;
  Status?: string;
}
