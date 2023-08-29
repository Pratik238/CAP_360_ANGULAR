import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { NgxSpinnerService } from 'ngx-spinner';
import { constants } from 'src/app/constants';
import { DataProvider } from 'src/app/helpers/providers/data.provider';
import { studentTestEnum } from 'src/app/models/Enum/student-test';
import { User } from 'src/app/models/interfaces';
import { AdminCommonEndpointsService } from 'src/app/services/admin-common-endpoints.service';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { StudentCommonEndpointsService } from 'src/app/services/student-common-endpoints.service';

@Component({
  selector: 'app-jumble-test-report',
  templateUrl: './jumble-test-report.component.html',
  styleUrls: ['./jumble-test-report.component.scss']
})
export class JumbleTestReportComponent implements OnInit {

 
  user: User;
  scoreCardBasicInfo: any[] = [];
  indvidualReportForm: FormGroup;
  subjects: any[] = [];
  examIds: any[] = [];
  subTopicsData: any[] = [];
  currentIndex: number;
  isDisplayMathsReport: boolean = true;

  constructor(private spinnerService: NgxSpinnerService,
              private dataProvider: DataProvider,
              private authenticationService: AuthenticationService,
              private adminCommonEndpointsService: AdminCommonEndpointsService,
              private fb: FormBuilder,
              private router: Router,
              private studentCommonEndpointsService: StudentCommonEndpointsService) {
     }

  ngOnInit() {
    this.user = this.authenticationService.userValue;
    this.indvidualReportForm = this.fb.group({
      SubjectId: new FormControl(null, Validators.required),
      ExamId: new FormControl(null, Validators.required)
    });
    // 
    this.loadMathsSatScoreCardData();
    this.spinnerService.show();
    setTimeout(() => {
    this.spinnerService.hide();
    }, 1000);
  }

  loadMathsSatScoreCardData() {
    this.spinnerService.show();
    const dropdownObj = {
      dropdown: 'Subjects',
      sortby: 'SubjectName',
      selectfields: 'SubjectName as name,SubjectId as id'
    };
    this.adminCommonEndpointsService.getDropdowns(dropdownObj).subscribe(result => {
      this.subjects = result['message'];
    });
    this.studentCommonEndpointsService.getPracticeExamCUMReport(this.user.UserId, studentTestEnum.JumbleTest).subscribe(result => {
      this.scoreCardBasicInfo = result;
    }, e => {
      this.spinnerService.hide();
    });
    this.spinnerService.hide();
  }

    // change methods
    onChangeSubject(event) {
      if (event.target.value !== null && event.target.value !== '' && event.target.value === constants.subject_Math_Id) {
        this.isDisplayMathsReport = true;
        this.studentCommonEndpointsService.getPracticeSATExamIds(this.user.UserId, studentTestEnum.JumbleTest, event.target.value).subscribe(result => {
          this.examIds = result;
        }, e => {
          this.spinnerService.hide();
        });
            
        this.studentCommonEndpointsService.getPracticeExamCUMReport(this.user.UserId, studentTestEnum.JumbleTest).subscribe(result => {
          this.scoreCardBasicInfo = result;
        }, e => {
          this.spinnerService.hide();
        });
        this.subTopicsData = [];
      } else if (event.target.value !== null && event.target.value !== '' && event.target.value === constants.subject_English_Id) {
        this.isDisplayMathsReport = false;
        this.studentCommonEndpointsService.getPracticeSATExamIds(this.user.UserId, studentTestEnum.JumbleTest, event.target.value).subscribe(result => {
          this.examIds = result;
        }, e => {
            this.spinnerService.hide();
        });
        this.studentCommonEndpointsService.getPracticeSATEnglishExamCumulativeReport(this.user.UserId, studentTestEnum.JumbleTest).subscribe(result => {
          this.scoreCardBasicInfo = result;
        }, e => {
          this.spinnerService.hide();
        });
        this.subTopicsData = [];
        this.indvidualReportForm.get('ExamId').patchValue(null);
      } else {
        this.isDisplayMathsReport = true;
        this.subTopicsData = [];
        this.indvidualReportForm.get('ExamId').patchValue(null);
        this.loadMathsSatScoreCardData();
      }
    }
  
    isFormValid() {
      return this.indvidualReportForm.valid;
    }
  
    onSearchData() {
      if (this.isDisplayMathsReport) {
      this.studentCommonEndpointsService.getPracticeExamScore(this.user.UserId, this.indvidualReportForm.get('ExamId').value, studentTestEnum.JumbleTest).subscribe(result => {
       this.scoreCardBasicInfo = result;
      }, e => {
        this.scoreCardBasicInfo = [];
      });
    } else {
      this.studentCommonEndpointsService.getPracticeSATExamEnglishScore(this.user.UserId, this.indvidualReportForm.get('ExamId').value, studentTestEnum.JumbleTest).subscribe(result => {
        this.scoreCardBasicInfo = result;
      }, e => {
        this.spinnerService.hide();
        this.scoreCardBasicInfo = [];
      });
    }
    }

    downloadFile(data: any) {
      let scoreCardData;
      if (this.subTopicsData.length > 0) {
        scoreCardData = this.subTopicsData;
      } else {
        scoreCardData = this.scoreCardBasicInfo;
      }
      if (scoreCardData !== null && scoreCardData !== undefined) {
        const replacer = (key, value) => (value === null ? '' : value); // specify how you want to handle null values here
        const header = Object.keys(scoreCardData[0]);
      const csv = scoreCardData.map((row) =>
      header
      .map((fieldName) => JSON.stringify(row[fieldName], replacer))
          .join(',')
          );
          csv.unshift(header.join(','));
          const csvArray = csv.join('\r\n');
          
          const a = document.createElement('a');
          const blob = new Blob([csvArray], { type: 'text/csv' });
          const url = window.URL.createObjectURL(blob);
          
          a.href = url;
          a.download = 'JumbleTestScorecardReport.csv';
          a.click();
          window.URL.revokeObjectURL(url);
          a.remove();
        }
    }

  // english subject
  expandEnglishScoreCardDetails(info) {
    this.spinnerService.show();
    this.studentCommonEndpointsService.getPracticeEnglishTopicsandsubtopicsScore(this.user.UserId,  info.ExamId, studentTestEnum.JumbleTest).subscribe(result => {
      this.subTopicsData = result;
      this.spinnerService.hide();
    }, e => {
      this.spinnerService.hide();
    });
    this.currentIndex = info.ExamId;
  }
    
  expandScoreDetails(info, i) {
    this.spinnerService.show();
    this.studentCommonEndpointsService.getPracticeExamTopicsSubtopicScore(this.user.UserId,  info.ExamId, studentTestEnum.JumbleTest).subscribe(result => {
      this.subTopicsData = result;
      this.spinnerService.hide();
    }, e => {
      this.spinnerService.hide();
    });
    this.currentIndex = info.ExamId;
  }

  collapseScoreDetails(info, i) {
    this.currentIndex = 0;
    this.subTopicsData = [];
  }
  
  // main table column info code starts here
  noCalMulCorrect(info) {
    this.dataProvider.storage = {
      studentId: this.user.UserId,
      ExamId: info.ExamId,
      Name: "",
      Type: constants.examResult_NonMulCorrect,
      ExamtypeId: studentTestEnum.JumbleTest,
      isFromPracticeTest: false
    };
    this.router.navigate(['/user/score-card/test-questions']);
  }

  noCalMulWrong(info) {
    this.dataProvider.storage = {
      studentId: this.user.UserId,
      ExamId: info.ExamId,
      Name: constants.examResult_Others,
      Type: constants.examResult_NoCalMulWrong,
      ExamtypeId: studentTestEnum.JumbleTest,
      isFromPracticeTest: false
    };
    this.router.navigate(['/user/score-card/test-questions']);
  }

  noCalTotalMul(info) {
    this.dataProvider.storage = {
      studentId: this.user.UserId,
      ExamId: info.ExamId,
      Name: constants.examResult_Others,
      Type: constants.examResult_NoCalMulTotal,
      ExamtypeId: studentTestEnum.JumbleTest,
      isFromPracticeTest: false
    };
    this.router.navigate(['/user/score-card/test-questions']);
  }

  noCalGridCorrect(info) {
    this.dataProvider.storage = {
      studentId: this.user.UserId,
      ExamId: info.ExamId,
      Name: constants.examResult_Others,
      Type: constants.examResult_NoCalgridCorrect,
      ExamtypeId: studentTestEnum.JumbleTest,
      isFromPracticeTest: false
    };
    this.router.navigate(['/user/score-card/test-questions']);
  }

  noCalGridWrong(info) {
    this.dataProvider.storage = {
      studentId: this.user.UserId,
      ExamId: info.ExamId,
      Name: constants.examResult_Others,
      Type: constants.examResult_NoCalGridWrong,
      ExamtypeId: studentTestEnum.JumbleTest,
      isFromPracticeTest: false
    };
    this.router.navigate(['/user/score-card/test-questions']);
  }

  noCalGridTotal(info) {
    this.dataProvider.storage = {
      studentId: this.user.UserId,
      ExamId: info.ExamId,
      Name: constants.examResult_Others,
      Type: constants.examResult_NoCalGridWrong,
      ExamtypeId: studentTestEnum.JumbleTest,
      isFromPracticeTest: false
    };
    this.router.navigate(['/user/score-card/test-questions']);
  }

  calMulCorrect(info) {
    this.dataProvider.storage = {
      studentId: this.user.UserId,
      ExamId: info.ExamId,
      Name: constants.examResult_Others,
      Type: constants.examResult_CalMulcorrect,
      ExamtypeId: studentTestEnum.JumbleTest,
      isFromPracticeTest: false
    };
    this.router.navigate(['/user/score-card/test-questions']);
  }

  calMulWrong(info) {
    this.dataProvider.storage = {
      studentId: this.user.UserId,
      ExamId: info.ExamId,
      Name: constants.examResult_Others,
      Type: constants.examResult_CalMulWrong,
      ExamtypeId: studentTestEnum.JumbleTest,
      isFromPracticeTest: false
    };
    this.router.navigate(['/user/score-card/test-questions']);
  }

  calMulTotal(info) {
    this.dataProvider.storage = {
      studentId: this.user.UserId,
      ExamId: info.ExamId,
      Name: constants.examResult_Others,
      Type: constants.examResult_CalMulTotal,
      ExamtypeId: studentTestEnum.JumbleTest,
      isFromPracticeTest: false
    };
    this.router.navigate(['/user/score-card/test-questions']);
  }

  calGridCorrect(info) {
    this.dataProvider.storage = {
      studentId: this.user.UserId,
      ExamId: info.ExamId,
      Name: constants.examResult_Others,
      Type: constants.examResult_CalGridCorrect,
      ExamtypeId: studentTestEnum.JumbleTest,
      isFromPracticeTest: false
    };
    this.router.navigate(['/user/score-card/test-questions']);
  }

  calGridWrong(info) {
    this.dataProvider.storage = {
      studentId: this.user.UserId,
      ExamId: info.ExamId,
      Name: constants.examResult_Others,
      Type: constants.examResult_CalGridWrong,
      ExamtypeId: studentTestEnum.JumbleTest,
      isFromPracticeTest: false
    };
    this.router.navigate(['/user/score-card/test-questions']);
  }

  calGridTotal(info) {
    this.dataProvider.storage = {
      studentId: this.user.UserId,
      ExamId: info.ExamId,
      Name: constants.examResult_Others,
      Type: constants.examResult_CalGridTotal,
      ExamtypeId: studentTestEnum.JumbleTest,
      isFromPracticeTest: false
    };
    this.router.navigate(['/user/score-card/test-questions']);
  }
    // main table column info code ends here

  totalCorrectAnswers(qData) {
    this.dataProvider.storage = {
      studentId: this.user.UserId,
      ExamId: qData.ExamId,
      Name: qData.Name,
      Type: constants.examResult_CorrectAnswers,
      ExamtypeId: studentTestEnum.JumbleTest,
      isFromPracticeTest: false
    };
    this.router.navigate(['/user/score-card/test-questions']);
  }

  totalIncorrectAnswers(qData) {
    this.dataProvider.storage = {
      studentId: this.user.UserId,
      ExamId: qData.ExamId,
      Name: qData.Name,
      Type: constants.examResult_IncorrectAnswers,
      ExamtypeId: studentTestEnum.JumbleTest,
      isFromPracticeTest: false
    };
    this.router.navigate(['/user/score-card/test-questions']);
  }

  totalQuestionAnswers(qData) {
    this.dataProvider.storage = {
      studentId: this.user.UserId,
      ExamId: qData.ExamId,
      Name: qData.Name,
      Type: constants.examResult_TotalQuesAnswers,
      ExamtypeId: studentTestEnum.JumbleTest,
      isFromPracticeTest: false
    };
    this.router.navigate(['/user/score-card/test-questions']);
  }

  totalNonCalculateMulQs(qData) {
    this.dataProvider.storage = {
      studentId: this.user.UserId,
      ExamId: qData.ExamId,
      Name: qData.Name,
      Type: constants.examResult_NoCalMulTotal,
      ExamtypeId: studentTestEnum.JumbleTest,
      isFromPracticeTest: false
    };
    this.router.navigate(['/user/score-card/test-questions']);
  }

  NonCalcMulCorrectQs(qData) {
    this.dataProvider.storage = {
      studentId: this.user.UserId,
      ExamId: qData.ExamId,
      Name: qData.Name,
      Type: constants.examResult_NonMulCorrect,
      ExamtypeId: studentTestEnum.JumbleTest,
      isFromPracticeTest: false
    };
    this.router.navigate(['/user/score-card/test-questions']);
  }

  NonCalcMulWrongQs(qData) {
    this.dataProvider.storage = {
      studentId: this.user.UserId,
      ExamId: qData.ExamId,
      Name: qData.Name,
      Type: constants.examResult_NoCalMulWrong,
      ExamtypeId: studentTestEnum.JumbleTest,
      isFromPracticeTest: false
    };
    this.router.navigate(['/user/score-card/test-questions']);
  }

  NonCalcGridCorrectQs(qData) {
    this.dataProvider.storage = {
      studentId: this.user.UserId,
      ExamId: qData.ExamId,
      Name: qData.Name,
      Type: constants.examResult_NoCalgridCorrect,
      ExamtypeId: studentTestEnum.JumbleTest,
      isFromPracticeTest: false
    };
    this.router.navigate(['/user/score-card/test-questions']);
  }

  NonCalcGridWrongQs(qData) {
    this.dataProvider.storage = {
      studentId: this.user.UserId,
      ExamId: qData.ExamId,
      Name: qData.Name,
      Type: constants.examResult_NoCalGridWrong,
      ExamtypeId: studentTestEnum.JumbleTest,
      isFromPracticeTest: false
    };
    this.router.navigate(['/user/score-card/test-questions']);
  }

  totalNonCalcGridInQs(qData) {
    this.dataProvider.storage = {
      studentId: this.user.UserId,
      ExamId: qData.ExamId,
      Name: qData.Name,
      Type: constants.examResult_NoCalGridTotal,
      ExamtypeId: studentTestEnum.JumbleTest,
      isFromPracticeTest: false
    };
    this.router.navigate(['/user/score-card/test-questions']);
  }

  totalCalcMulQs(qData) {
    this.dataProvider.storage = {
      studentId: this.user.UserId,
      ExamId: qData.ExamId,
      Name: qData.Name,
      Type: constants.examResult_CalMulTotal,
      ExamtypeId: studentTestEnum.JumbleTest,
      isFromPracticeTest: false
    };
    this.router.navigate(['/user/score-card/test-questions']);
  }

  calcMulCorrectQs(qData) {
    this.dataProvider.storage = {
      studentId: this.user.UserId,
      ExamId: qData.ExamId,
      Name: qData.Name,
      Type: constants.examResult_CalMulcorrect,
      ExamtypeId: studentTestEnum.JumbleTest,
      isFromPracticeTest: false
    };
    this.router.navigate(['/user/score-card/test-questions']);
  }

  calcMulWrongQs(qData) {
    this.dataProvider.storage = {
      studentId: this.user.UserId,
      ExamId: qData.ExamId,
      Name: qData.Name,
      Type: constants.examResult_CalMulWrong,
      ExamtypeId: studentTestEnum.JumbleTest,
      isFromPracticeTest: false
    };
    this.router.navigate(['/user/score-card/test-questions']);
  }

  calcGridCorrectQs(qData) {
    this.dataProvider.storage = {
      studentId: this.user.UserId,
      ExamId: qData.ExamId,
      Name: qData.Name,
      Type: constants.examResult_CalGridCorrect,
      ExamtypeId: studentTestEnum.JumbleTest,
      isFromPracticeTest: false
    };
    this.router.navigate(['/user/score-card/test-questions']);
  }

  calcGridWrongQs(qData) {
    this.dataProvider.storage = {
      studentId: this.user.UserId,
      ExamId: qData.ExamId,
      Name: qData.Name,
      Type: constants.examResult_CalGridWrong,
      ExamtypeId: studentTestEnum.JumbleTest,
      isFromPracticeTest: false
    };
    this.router.navigate(['/user/score-card/test-questions']);
  }

  totalCalcGridInQs(qData) {
    this.dataProvider.storage = {
      studentId: this.user.UserId,
      ExamId: qData.ExamId,
      Name: qData.Name,
      Type: constants.examResult_CalGridTotal,
      ExamtypeId: studentTestEnum.JumbleTest,
      isFromPracticeTest: false
    };
    this.router.navigate(['/user/score-card/test-questions']);
  }

    // below mehtods are used to navigate to display the english questions
   
  // below mehtods are used to navigate to display the english questions
  readingSecCorrectQs(qData) {
    this.dataProvider.storage = {
      studentId: this.user.UserId,
      ExamId: qData.ExamId,
      Name: qData.Name,
      Type: constants.englishExamResult_CorrectAnswers,
      ExamtypeId: studentTestEnum.JumbleTest,
      isFromPracticeTest: true
    };
    this.router.navigate(['/user/score-card/english-test-questions']);
  }
  
  // reading Grammar section code starts here
  readingGrammarCorrectQs(qData) {
    this.dataProvider.storage = {
      studentId: this.user.UserId,
      ExamId: qData.ExamId,
      Name: qData.Name,
      Type: constants.englishExamResult_ReadingGrammarCorrect,
      ExamtypeId: studentTestEnum.JumbleTest,
      isFromPracticeTest: true
    };
    this.router.navigate(['/user/score-card/english-test-questions']);
  }
  
  readingGrammarSecWrongQs(qData) {
    this.dataProvider.storage = {
      studentId: this.user.UserId,
      ExamId: qData.ExamId,
      Name: qData.Name,
      Type: constants.englishExamResult_ReadingGrammarWrong,
      ExamtypeId: studentTestEnum.JumbleTest,
      isFromPracticeTest: true
    };
    this.router.navigate(['/user/score-card/english-test-questions']);
  }
  
  totalReadingGrammarQs(qData) {
    this.dataProvider.storage = {
      studentId: this.user.UserId,
      ExamId: qData.ExamId,
      Name: qData.Name,
      Type: constants.englishExamResult_Others,
      ExamtypeId: studentTestEnum.JumbleTest,
      isFromPracticeTest: true
    };
    this.router.navigate(['/user/score-card/english-test-questions']);
  }

  // reading ineferencing sec code starts here
  readingInferencingCorrectQs(qData) {
    this.dataProvider.storage = {
      studentId: this.user.UserId,
      ExamId: qData.ExamId,
      Name: qData.Name,
      Type: constants.englishExamResult_ReadingInferencingCorrect,
      ExamtypeId: studentTestEnum.JumbleTest,
      isFromPracticeTest: true
    };
    this.router.navigate(['/user/score-card/english-test-questions']);
  }
  
  readingInferencingWrongQs(qData) {
    this.dataProvider.storage = {
      studentId: this.user.UserId,
      ExamId: qData.ExamId,
      Name: qData.Name,
      Type: constants.englishExamResult_ReadingInferencingWrong,
      ExamtypeId: studentTestEnum.JumbleTest,
      isFromPracticeTest: true
    };
    this.router.navigate(['/user/score-card/english-test-questions']);
  }
  
  totalReadingInferencingQs(qData) {
    this.dataProvider.storage = {
      studentId: this.user.UserId,
      ExamId: qData.ExamId,
      Name: qData.Name,
      Type: constants.englishExamResult_ReadingInferencingTotal,
      ExamtypeId: studentTestEnum.JumbleTest,
      isFromPracticeTest: true
    };
    this.router.navigate(['/user/score-card/english-test-questions']);
  }

  // reading paragraphing sec code starts here
  readingParaphrasingCorrectQs(qData) {
    this.dataProvider.storage = {
      studentId: this.user.UserId,
      ExamId: qData.ExamId,
      Name: qData.Name,
      Type: constants.englishExamResult_ReadingParaphrasingCorrect,
      ExamtypeId: studentTestEnum.JumbleTest,
      isFromPracticeTest: true
    };
    this.router.navigate(['/user/score-card/english-test-questions']);
  }
  
  readingParaphrasingWrongQs(qData) {
    this.dataProvider.storage = {
      studentId: this.user.UserId,
      ExamId: qData.ExamId,
      Name: qData.Name,
      Type: constants.englishExamResult_ReadingParaphrasingWrong,
      ExamtypeId: studentTestEnum.JumbleTest,
      isFromPracticeTest: true
    };
    this.router.navigate(['/user/score-card/english-test-questions']);
  }
  
  totalReadingParaphrasingQs(qData) {
    this.dataProvider.storage = {
      studentId: this.user.UserId,
      ExamId: qData.ExamId,
      Name: qData.Name,
      Type: constants.englishExamResult_ReadingParaphrasingTotal,
      ExamtypeId: studentTestEnum.JumbleTest,
      isFromPracticeTest: true
    };
    this.router.navigate(['/user/score-card/english-test-questions']);
  }

  // reading Main idea sec code starts here
  readingMainIdeaCorrectQs(qData) {
    this.dataProvider.storage = {
      studentId: this.user.UserId,
      ExamId: qData.ExamId,
      Name: qData.Name,
      Type: constants.englishExamResult_ReadingParaphrasingCorrect,
      ExamtypeId: studentTestEnum.JumbleTest,
      isFromPracticeTest: true
    };
    this.router.navigate(['/user/score-card/english-test-questions']);
  }
  
  readingMainIdeaWrongQs(qData) {
    this.dataProvider.storage = {
      studentId: this.user.UserId,
      ExamId: qData.ExamId,
      Name: qData.Name,
      Type: constants.englishExamResult_ReadingParaphrasingWrong,
      ExamtypeId: studentTestEnum.JumbleTest,
      isFromPracticeTest: true
    };
    this.router.navigate(['/user/score-card/english-test-questions']);
  }
  
  totalReadingMainIdeaQs(qData) {
    this.dataProvider.storage = {
      studentId: this.user.UserId,
      ExamId: qData.ExamId,
      Name: qData.Name,
      Type: constants.englishExamResult_ReadingParaphrasingTotal,
      ExamtypeId: studentTestEnum.JumbleTest,
      isFromPracticeTest: true
    };
    this.router.navigate(['/user/score-card/english-test-questions']);
  }

  // reading Vocabulary sec code starts here
  readingVocabularyCorrectQs(qData) {
    this.dataProvider.storage = {
      studentId: this.user.UserId,
      ExamId: qData.ExamId,
      Name: qData.Name,
      Type: constants.englishExamResult_ReadingVocaabularyCorrect,
      ExamtypeId: studentTestEnum.JumbleTest,
      isFromPracticeTest: true
    };
    this.router.navigate(['/user/score-card/english-test-questions']);
  }
  
  readingVocabularyWrongQs(qData) {
    this.dataProvider.storage = {
      studentId: this.user.UserId,
      ExamId: qData.ExamId,
      Name: qData.Name,
      Type: constants.englishExamResult_ReadingVocaabularyWrong,
      ExamtypeId: studentTestEnum.JumbleTest,
      isFromPracticeTest: true
    };
    this.router.navigate(['/user/score-card/english-test-questions']);
  }
  
  totalReadingVocabularyQs(qData) {
    this.dataProvider.storage = {
      studentId: this.user.UserId,
      ExamId: qData.ExamId,
      Name: qData.Name,
      Type: constants.englishExamResult_ReadingVocaabularyCorrect,
      ExamtypeId: studentTestEnum.JumbleTest,
      isFromPracticeTest: true
    };
    this.router.navigate(['/user/score-card/english-test-questions']);
  }
  
  
  // reading Grammar section code starts here
 writingGrammarCorrectQs(qData) {
    this.dataProvider.storage = {
      studentId: this.user.UserId,
      ExamId: qData.ExamId,
      Name: qData.Name,
      Type: constants.englishExamResult_WrittingGrammarCorrect,
      ExamtypeId: studentTestEnum.JumbleTest,
      isFromPracticeTest: true
    };
    this.router.navigate(['/user/score-card/english-test-questions']);
  }
  
  writtingGrammarSecWrongQs(qData) {
    this.dataProvider.storage = {
      studentId: this.user.UserId,
      ExamId: qData.ExamId,
      Name: qData.Name,
      Type: constants.englishExamResult_WrittingGrammarWrong,
      ExamtypeId: studentTestEnum.JumbleTest,
      isFromPracticeTest: true
    };
    this.router.navigate(['/user/score-card/english-test-questions']);
  }
  
  writtingReadingGrammarQs(qData) {
    this.dataProvider.storage = {
      studentId: this.user.UserId,
      ExamId: qData.ExamId,
      Name: qData.Name,
      Type: constants.englishExamResult_Others,
      ExamtypeId: studentTestEnum.JumbleTest,
      isFromPracticeTest: true
    };
    this.router.navigate(['/user/score-card/english-test-questions']);
  }

  // reading ineferencing sec code starts here
  writtingInferencingCorrectQs(qData) {
    this.dataProvider.storage = {
      studentId: this.user.UserId,
      ExamId: qData.ExamId,
      Name: qData.Name,
      Type: constants.englishExamResult_WrittingInferencingCorrect,
      ExamtypeId: studentTestEnum.JumbleTest,
      isFromPracticeTest: true
    };
    this.router.navigate(['/user/score-card/english-test-questions']);
  }
  
  writtingInferencingWrongQs(qData) {
    this.dataProvider.storage = {
      studentId: this.user.UserId,
      ExamId: qData.ExamId,
      Name: qData.Name,
      Type: constants.englishExamResult_WrittingInferencingWrong,
      ExamtypeId: studentTestEnum.JumbleTest,
      isFromPracticeTest: true
    };
    this.router.navigate(['/user/score-card/english-test-questions']);
  }
  
  writtingReadingInferencingQs(qData) {
    this.dataProvider.storage = {
      studentId: this.user.UserId,
      ExamId: qData.ExamId,
      Name: qData.Name,
      Type: constants.englishExamResult_WrittingInferencingTotal,
      ExamtypeId: studentTestEnum.JumbleTest,
      isFromPracticeTest: true
    };
    this.router.navigate(['/user/score-card/english-test-questions']);
  }

  // reading paragraphing sec code starts here
  writtingParaphrasingCorrectQs(qData) {
    this.dataProvider.storage = {
      studentId: this.user.UserId,
      ExamId: qData.ExamId,
      Name: qData.Name,
      Type: constants.englishExamResult_WrittingParaphrasingCorrect,
      ExamtypeId: studentTestEnum.JumbleTest,
      isFromPracticeTest: true
    };
    this.router.navigate(['/user/score-card/english-test-questions']);
  }
  
  writtingParaphrasingWrongQs(qData) {
    this.dataProvider.storage = {
      studentId: this.user.UserId,
      ExamId: qData.ExamId,
      Name: qData.Name,
      Type: constants.englishExamResult_WrittingParaphrasingWrong,
      ExamtypeId: studentTestEnum.JumbleTest,
      isFromPracticeTest: true
    };
    this.router.navigate(['/user/score-card/english-test-questions']);
  }
  
  totalwrittingParaphrasingQs(qData) {
    this.dataProvider.storage = {
      studentId: this.user.UserId,
      ExamId: qData.ExamId,
      Name: qData.Name,
      Type: constants.englishExamResult_WrittingParaphrasingTotal,
      ExamtypeId: studentTestEnum.JumbleTest,
      isFromPracticeTest: true
    };
    this.router.navigate(['/user/score-card/english-test-questions']);
  }

  // reading Main idea sec code starts here
  writtingMainIdeaCorrectQs(qData) {
    this.dataProvider.storage = {
      studentId: this.user.UserId,
      ExamId: qData.ExamId,
      Name: qData.Name,
      Type: constants.englishExamResult_WrittingParaphrasingCorrect,
      ExamtypeId: studentTestEnum.JumbleTest,
      isFromPracticeTest: true
    };
    this.router.navigate(['/user/score-card/english-test-questions']);
  }
  
  writtingMainIdeaWrongQs(qData) {
    this.dataProvider.storage = {
      studentId: this.user.UserId,
      ExamId: qData.ExamId,
      Name: qData.Name,
      Type: constants.englishExamResult_WrittingParaphrasingWrong,
      ExamtypeId: studentTestEnum.JumbleTest,
      isFromPracticeTest: true
    };
    this.router.navigate(['/user/score-card/english-test-questions']);
  }
  
  totalwrittingMainIdeaQs(qData) {
    this.dataProvider.storage = {
      studentId: this.user.UserId,
      ExamId: qData.ExamId,
      Name: qData.Name,
      Type: constants.englishExamResult_WrittingParaphrasingTotal,
      ExamtypeId: studentTestEnum.JumbleTest,
      isFromPracticeTest: true
    };
    this.router.navigate(['/user/score-card/english-test-questions']);
  }

  // reading Vocabulary sec code starts here
  writtingVocabularyCorrectQs(qData) {
    this.dataProvider.storage = {
      studentId: this.user.UserId,
      ExamId: qData.ExamId,
      Name: qData.Name,
      Type: constants.englishExamResult_WrittingVocaabularyCorrect,
      ExamtypeId: studentTestEnum.JumbleTest,
      isFromPracticeTest: true
    };
    this.router.navigate(['/user/score-card/english-test-questions']);
  }
  
  writtingVocabularyWrongQs(qData) {
    this.dataProvider.storage = {
      studentId: this.user.UserId,
      ExamId: qData.ExamId,
      Name: qData.Name,
      Type: constants.englishExamResult_WrittingVocaabularyWrong,
      ExamtypeId: studentTestEnum.JumbleTest,
      isFromPracticeTest: true
    };
    this.router.navigate(['/user/score-card/english-test-questions']);
  }
  
  totalwrittingVocabularyQs(qData) {
    this.dataProvider.storage = {
      studentId: this.user.UserId,
      ExamId: qData.ExamId,
      Name: qData.Name,
      Type: constants.englishExamResult_WrittingVocaabularyTotal,
      ExamtypeId: studentTestEnum.JumbleTest,
      isFromPracticeTest: true
    };
    this.router.navigate(['/user/score-card/english-test-questions']);
  }
  
  writtingSecCorrectQs(qData) {
    this.dataProvider.storage = {
      studentId: this.user.UserId,
      ExamId: qData.ExamId,
      Name: qData.Name,
      Type: constants.englishExamResult_WrittingVocaabularyTotal,
      ExamtypeId: studentTestEnum.JumbleTest,
      isFromPracticeTest: true
    };
    this.router.navigate(['/user/score-card/english-test-questions']);
  }
  
  readingTotalWrongQs(qData) {
    this.dataProvider.storage = {
      studentId: this.user.UserId,
      ExamId: qData.ExamId,
      Name: '',
      Type: constants.englishExamResult_Others,
      ExamtypeId: studentTestEnum.JumbleTest,
      isFromPracticeTest: true
    };
    this.router.navigate(['/user/score-card/english-test-questions']);
  }
  
  writtingTotalWrongQs(qData) {
    this.dataProvider.storage = {
      studentId: this.user.UserId,
      ExamId: qData.ExamId,
      Name: '',
      Type: constants.englishExamResult_Others,
      ExamtypeId: studentTestEnum.JumbleTest,
      isFromPracticeTest: true
    };
    this.router.navigate(['/user/score-card/english-test-questions']);
  }

  totalReadingSecQs(qData) {
    this.dataProvider.storage = {
      studentId: this.user.UserId,
      ExamId: qData.ExamId,
      Name: constants.examResult_Others,
      Type: constants.englishExamResult_ReadingTotal,
      ExamtypeId: studentTestEnum.JumbleTest,
      isFromPracticeTest: true
    };
    this.router.navigate(['/user/score-card/english-test-questions']);
  }
  
  totalReadWrongSecQs(qData) {
    this.dataProvider.storage = {
      studentId: this.user.UserId,
      ExamId: qData.ExamId,
      Name: constants.examResult_Others,
      Type: constants.englishExamResult_TotalReadWrong,
      ExamtypeId: studentTestEnum.JumbleTest,
      isFromPracticeTest: true
    };
    this.router.navigate(['/user/score-card/english-test-questions']);
  }
  
  totalReadingCorrectQs(qData) {
    this.dataProvider.storage = {
      studentId: this.user.UserId,
      ExamId: qData.ExamId,
      Name: constants.examResult_Others,
      Type: constants.englishExamResult_TotalReadCorrect,
      ExamtypeId: studentTestEnum.JumbleTest,
      isFromPracticeTest: true
    };
    this.router.navigate(['/user/score-card/english-test-questions']);
  }
  
  totalWrittingSecQs(qData) {
    this.dataProvider.storage = {
      studentId: this.user.UserId,
      ExamId: qData.ExamId,
      Name: constants.examResult_Others,
      Type: constants.englishExamResult_WrittingTotal,
      ExamtypeId: studentTestEnum.JumbleTest,
      isFromPracticeTest: true
    };
    this.router.navigate(['/user/score-card/english-test-questions']);
  }
  
  totalWrittingSecWrongQs(qData) {
    this.dataProvider.storage = {
      studentId: this.user.UserId,
      ExamId: qData.ExamId,
      Name: constants.examResult_Others,
      Type: constants.englishExamResult_TotalWriteWrong,
      ExamtypeId: studentTestEnum.JumbleTest,
      isFromPracticeTest: true
    };
    this.router.navigate(['/user/score-card/english-test-questions']);
  }
  
  totalWrittingCorrectQs(qData) {
    this.dataProvider.storage = {
      studentId: this.user.UserId,
      ExamId: qData.ExamId,
      Name: constants.examResult_Others,
      Type: constants.englishExamResult_TotalWriteCorrect,
      ExamtypeId: studentTestEnum.JumbleTest,
      isFromPracticeTest: true
    };
    this.router.navigate(['/user/score-card/english-test-questions']);
  }
}
