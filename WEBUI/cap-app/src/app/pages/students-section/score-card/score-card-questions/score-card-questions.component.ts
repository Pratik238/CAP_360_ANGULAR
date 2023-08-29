import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { LazyLoadEvent } from 'primeng/api';
import { constants } from 'src/app/constants';
import { DataProvider } from 'src/app/helpers/providers/data.provider';
import { AdminCommonEndpointsService } from 'src/app/services/admin-common-endpoints.service';
import { StudentCommonEndpointsService } from 'src/app/services/student-common-endpoints.service';

@Component({
  selector: 'app-score-card-questions',
  templateUrl: './score-card-questions.component.html',
  styleUrls: ['./score-card-questions.component.scss']
})
export class ScoreCardQuestionsComponent implements OnInit {

  @ViewChild('displayQuestions') displayQuestions: ElementRef;

    selectedExamInfo: any;
    allQuestionData: any[] = [];
    dataSource: any[] = [];
    totalRecords: number;
    isActiveRecord: boolean = true;
    currentstatus: string = 'Active';
    pageSize: number = 10;
    loading: boolean = false;
    questionType: string = null;
    pieChartReport: any;
    isFromPracticeTest: boolean;
    studentId: number;
    ExamId: number;
    Name: string = '';
    Type: string;
    ExamtypeId: number;

  constructor(private dataProvider: DataProvider,
              private router: Router,
              private studentCommonEndpointsService: StudentCommonEndpointsService,
              private adminCommonEndpointsService: AdminCommonEndpointsService,
              private spinnerService: NgxSpinnerService,
              private modalService: NgbModal) {
              if (this.dataProvider.storage) {
                this.studentId = this.dataProvider.storage['studentId'];
                this.ExamId = this.dataProvider.storage['ExamId'];
                this.Name = this.dataProvider.storage['Name'];
                this.Type = this.dataProvider.storage['Type'];
                this.ExamtypeId = this.dataProvider.storage['ExamtypeId'];
                this.isFromPracticeTest = this.dataProvider.storage['isFromPracticeTest'];
              }
   }

   ngOnInit() {
   }
 
   loadAllQuestions(event: LazyLoadEvent) {
    //  below condition is used to pass the empty string in API
     if (this.Name === '') {
       this.Name = JSON.parse(JSON.stringify(`''`));
     }
     this.spinnerService.show();
       this.studentCommonEndpointsService.getScorecardanswerersList(this.studentId, this.ExamId, this.Name, this.Type, this.ExamtypeId).subscribe(result => {
           this.dataSource = result;
           this.allQuestionData = this.dataSource.slice(event.first, (event.first + event.rows));
           this.totalRecords = this.dataSource.length;
         });
     this.spinnerService.hide();
   }
 
   getTypeName(type) {
     switch(type) {
      case constants.examResult_NonMulCorrect:
        return 'Non Calculator: Multiple Choice: Correct Answers';
      case constants.examResult_NoCalgridCorrect:
        return 'Non Calculator: Grid-In: Correct Answers';
      case constants.examResult_NoCalMulWrong:
        return 'Non Calculator: Multiple Choice: Wrong Answers';
      case constants.examResult_NoCalGridWrong:
        return 'Non Calculator: Grid-In: Wrong Answers';
      case constants.examResult_CalMulcorrect:
        return 'Calculator: Multiple Choice: Correct Answers';
      case constants.examResult_CalMulWrong:
        return 'Calculator: Multiple Choice: Wrong Answers';
      case constants.examResult_CalGridWrong:
        return 'Non Calculator: Grid-In: Wrong Answers';
      case constants.examResult_CalGridCorrect:
        return 'Non Calculator: Grid-In: Correct Answers';
      case constants.examResult_CalMulTotal:
        return 'Calculator: Multiple Choice: All Questions';
      case constants.examResult_CalGridTotal:
        return 'Calculator: Grid-In: All Questions';
      case constants.examResult_NoCalGridTotal:
        return 'Non Calculator: Grid-In: All Questions';
      case constants.examResult_NoCalMulTotal:
        return 'Non Calculator: Multiple Choice: All Questions';
      case constants.examResult_CorrectAnswers:
        return 'Correct Answers: All Questions';
      case constants.examResult_IncorrectAnswers:
        return 'Incorrect Answers: All Questions';
      case constants.examResult_TotalQuesAnswers:
        return 'All Questions';
     }
   }
 
 
     viewTopic(examInfo) {
       let tableName: string;
       if (this.isFromPracticeTest) {
         tableName =  'vw_PracticeQuestions';
       } else {
         tableName = 'vw_SATQuestions';
       }
      const viewRecord = {
         Table: tableName,
         PKey: 'QuestionId',
         PKeyFld: examInfo.QuestionId
       };
     this.adminCommonEndpointsService.getRecordById(viewRecord).subscribe(result => {
       this.spinnerService.show();
       this.selectedExamInfo = result['message'][0];
       this.modalService.open(this.displayQuestions, {
         size: 'lg', windowClass: 'confirm-dialog-window',
         centered: true, backdrop: 'static', keyboard: false
       });
     });
       this.spinnerService.hide();
     }
 
     navigateToResults() {
       this.router.navigate(['/user/exam']);
     }
 
     cancelQuestion() {
       this.modalService.dismissAll();
     }

}
