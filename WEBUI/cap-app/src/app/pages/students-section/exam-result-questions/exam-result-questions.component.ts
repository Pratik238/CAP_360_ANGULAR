import { constants } from './../../../constants';
import { StudentCommonEndpointsService } from 'src/app/services/student-common-endpoints.service';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { User } from 'src/app/models/interfaces';
import { LazyLoadEvent } from 'primeng/api';
import { NgxSpinnerService } from 'ngx-spinner';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SharedService } from 'src/app/helpers/providers/shared.service';
import { AdminCommonEndpointsService } from 'src/app/services/admin-common-endpoints.service';
import { LocationStrategy } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-exam-result-questions',
  templateUrl: './exam-result-questions.component.html',
  styleUrls: ['./exam-result-questions.component.scss']
})
export class ExamResultQuestionsComponent implements OnInit {

  @ViewChild('displayQuestions') displayQuestions: ElementRef;
  user: User;

  submitted = false;

  selectedExamInfo: any;
    isAddMode = true;
    allQuestionData: any[] = [];
    dataSource: any[] = [];
    totalRecords: number;
    isActiveRecord: boolean = true;
    currentstatus: string = 'Active';
    pageSize: number = 10;
    loading: boolean = false;
    ExamId: string = null;
    questionType: string = null;
    pieChartReport: any;
    isFromPracticeTest: boolean;

  constructor(private studentCommonEndpointsService: StudentCommonEndpointsService,
              private router: Router,
              private adminCommonEndpointsService: AdminCommonEndpointsService,
              private authenticationService: AuthenticationService,
              private sharedService: SharedService,
              private locationStrategy: LocationStrategy,
              private spinnerService: NgxSpinnerService,
              private modalService: NgbModal) { 
                this.user = this.authenticationService.userValue;
                const storage = this.sharedService.getStorage();
                if (storage) {
                  if (storage['ExamId'] !== undefined &&
                    storage['ExamId'] !== null ) {
                    this.ExamId = storage['ExamId'];
                    this.questionType = storage['questionType'];
                    this.pieChartReport  = storage['pieChartReport'];
                    this.isFromPracticeTest = storage['isFromPracticeTest'];
                  }
                } 

                this.sharedService.clearStorage();
              }

  ngOnInit() {
   this.preventBackButton();
  }

  // Define a function to handle back button and use anywhere
  preventBackButton() {
    history.pushState(null, null, location.href);
    this.locationStrategy.onPopState(() => {
      history.pushState(null, null, location.href);
    })
  }

  loadAllQuestions(event: LazyLoadEvent) {
    this.spinnerService.show();
    if (this.isFromPracticeTest) {
      this.studentCommonEndpointsService.getPracticeExamReportQuestions(this.user.UserId.toString(), this.ExamId).subscribe(result => {
          this.dataSource = result.filter(x => x.Type === this.questionType);
          this.allQuestionData = this.dataSource.slice(event.first, (event.first + event.rows));
          this.totalRecords = this.dataSource.length;
        });
      } else {
        this.studentCommonEndpointsService.getSATTestReportQuestions(this.user.UserId.toString(), this.ExamId).subscribe(result => {
          this.dataSource = result.filter(x => x.Type === this.questionType);
          this.allQuestionData = this.dataSource.slice(event.first, (event.first + event.rows));
          this.totalRecords = this.dataSource.length;
        });
      }
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
      this.sharedService.setStorage({ 
        isFromExamResult: true, 
        ExamId: this.ExamId, 
        pieChartReport: this.pieChartReport,
        isFromPracticeTest: this.isFromPracticeTest
        });
      this.router.navigate(['/user/exam']);
    }

    cancelQuestion() {
      this.modalService.dismissAll();
    }

}
