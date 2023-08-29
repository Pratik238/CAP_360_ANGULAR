export interface IEnglishQuestion {
  Id?: number;
  Paragraph?: string;
  questions?: IQuestions[];
}

export interface IQuestions {
    QuestionId?: string;
    QuestionText?: string;
    Option1?: string;
    Option2?: string;
    Option3?: string;
    Option4?: string;
    Answer?: string;
    Explanation?: string;
    SubjectId?: number;
    TopicId?: number; 
    SubTopicId?: number;
    EnglishSectionId?: number;
    IsHomework?: number;
    HomeWorkId?: number;
    DifficultyLevelId?: number;
    Createdby?: string;
    Updatedby?: string;
    CreatedDate?: string;
    UpdatedDate?: string;
}
