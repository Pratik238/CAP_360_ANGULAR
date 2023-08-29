export interface IAdminTableParams {
  Table?: string;
  FilterFieldName?: string;
  FilterFieldValue?: string;
  FilterFieldName1?: string;
  FilterFieldValue1?: string;
  Data?: IFields[];
}

export interface IFields {
  FieldName?: string;
  FieldValue?: string;
}

export interface IViewRecord {
    Table: string;
    PKey: string;
    PKeyFld: string;
}

export interface IChangeStatus {
    Table: string;
    PKey: string;
}

export interface IAddQuestions {
  SubjectId?: number;
  TopicId?: number;
  SubTopicId?: number;
  QuestionText?: string;
  Option1?: string;
  Option2?: string;
  Option3?: string;
  Option4?: string;
  Answer?: number;
  Explanation?: string;
  CalculatorId?: number;
  GridId?: number;
  IsHomeWork?: number;
  HomeworkId?: number;
  DifficultyLevelId?: number;
  IsActive?: number;
  Createdby?: string;
  Updatedby?: string;
}

export interface IUpdateQuestions extends IAddQuestions {
  QuestionId?: number;
}

export interface IAssignBatch {
  BatchId?: number;
  StudentIds?: string[];
  Createdby?: string;
  Updatedby?: string;
}

export interface IAddStudentAttendance {
  BatchId?: number;
  SubTopicId?: number;
  StudentId?: string;
  AttendanceDate?: string;
  AttendanceState?: string;
  Createdby?: string;
  Updatedby?: string;
}

export interface IAssignHomework {
  BatchId?: number;
  HomeWorkIds?: string[];
  Createdby?: string;
  Updatedby?: string;
}
export interface IAssignSATExam {
  BatchId?: number;
  SubTopicId?: string;
  Createdby?: string;
  Updatedby?: string;
}
export interface IAssignJumbleTest {
  BatchId?: number;
  TutorId?: number;
  SubjectId?: string;
  Status?: string;
  Createdby?: string;
  Updatedby?: string;
  CreatedDate?: string;
  UpdateDate?: string;
}
