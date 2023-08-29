export interface ITestResultReport {
    CalMulCorrect?: number;
    NoCalMulCorrect?: number;
    CalGridCorrect?: number;
    NoCalGridCorrect?: number;
    CalMulWrong?: number;
    NoCalMulWrong?: number;
    CalGridWrong?: number;
    NoCalGridWrong?: number;
    Noofanswered?: number;
    Noofskipped?: number;
    Noofunanswerd?: number;
}

export interface IEnglishTestResultReport {
    ReadInferencingCorrect?: number;
    ReadParaphrasingCorrect?: number;
    ReadmainideaCorrect?: number;
    ReadGrammarCorrect?: number;
    ReadVocaabularyCorrect?: number;
    WriteInferencingCorrect?: number;
    WriteParaphrasingCorrect?: number;
    WritemainideaCorrect?: number;
    WriteGrammarCorrect?: number;
    WriteVocaabularyCorrect?: number;
    ReadInferencingwrong?: number;
    ReadParaphrasingwrong?: number;
    Readmainideawrong?: number;
    ReadGrammarwrong?: number;
    ReadVocaabularywrong?: number;
    WriteInferencingwrong?: number;
    WriteParaphrasingwrong?: number;
    Writemainideawrong?: number;
    WriteGrammarwrong?: number;
    WriteVocaabularywrong?: number;
    ReadWrong?: number;
    Timetaken?: number;
    WriteCorrect?: number;
    WriteWrong?: number;
    ExamId?: number;
    NoCalGridWrong?: number;
    Noofanswered?: number;
    Noofskipped?: number;
    Noofunanswerd?: number;
}