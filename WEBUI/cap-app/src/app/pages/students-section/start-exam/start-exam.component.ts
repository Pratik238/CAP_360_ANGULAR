import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SharedService } from './../../../helpers/providers/shared.service';
import { IPracticeTest } from './../../../models/interfaces/exam-details.model';
import { AdminCommonEndpointsService } from 'src/app/services/admin-common-endpoints.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { constants } from 'src/app/constants';
import { ConfirmationService, MessageService } from 'primeng/api';
import { browserRefresh } from 'src/app/app.component';
import { IAdminTableParams } from 'src/app/models/interfaces/admin-table';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { User } from 'src/app/models/interfaces';
import { IAddExam } from 'src/app/models/interfaces/add-exam';
import { studentTestEnum } from 'src/app/models/Enum/student-test';
import { ExamTestComponent } from 'src/app/shared/exam-test/exam-test.component';
import { StudentCommonEndpointsService } from 'src/app/services/student-common-endpoints.service';
import { DatePipe, LocationStrategy } from '@angular/common';

@Component({
  selector: "app-start-exam",
  templateUrl: "./start-exam.component.html",
  styleUrls: ["./start-exam.component.scss"],
})
export class StartExamComponent implements OnInit {

  constants = constants; // set here so that it's available on html template
  @ViewChild('reportInvalidQuestion') reportInvalidQuestion: ElementRef;
  @ViewChild('nonCalcWarningMessage') nonCalcWarningMessage: ElementRef;
  @ViewChild('calcWarningMessage') calcWarningMessage: ElementRef;
  @ViewChild('endExamWarningMessage') endExamWarningMessage: ElementRef;
  @ViewChild('endExamConfirmation') endExamConfirmation: ElementRef;
  @ViewChild(ExamTestComponent) examTestComponent: ExamTestComponent;
  @Input() dataChange: any;

  public browserRefresh: boolean;

  page = 0;
  currentSection = 0;
  calculatorPage = 0;
  isShowBreakTime = false;
  reportQuestionForm: FormGroup;

  interval: any;

  nonCalcpager = {
    index: 0,
    size: 1,
    count: 1,
  };

  calcpager = {
    index: 0,
    size: 1,
    count: 1,
  };

  isBreakTime = false;

  calcCurrentPageIndex = 0;
  nonCalcCurrentPageIndex = 0;

  // new code added here
  allSatQuestions: IPracticeTest[] = [];
  combinedArray: any[] = [];
  calcQuestions: any[] = [];
  nonCalcQuestions: any[] = [];

  // count down timer code
  startingMinutes: number = 10;
  displayCountDownTime: number = 0;
  leftTime: number = 1;
  unSelectedQuestionsNonCalcCount: number = 0;
  unSelectedQuestionsCalcCount: number = 0;

  displayMinutes: number = 0;
  displaySeconds: number = 0;
  elapsedTime: number = 0;

  breakTime: number = 10;
  isOptionSelectedHideSkipQstn: boolean = true;
  isShowMultipleChoiceHeader: boolean = true;

  user: User;
  formValue: any;
  isFromMathsPracticeTest: boolean = true;
  isFromJumbleMathsTest: boolean = false;
  startDate: Date;
  datePipe = new DatePipe('en-US');

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private adminCommonEndpointsService: AdminCommonEndpointsService,
    private studentCommonEndpointsService: StudentCommonEndpointsService,
    private modalService: NgbModal,
    private spinnerService: NgxSpinnerService,
    private locationStrategy: LocationStrategy,
    private confirmationService: ConfirmationService,
    private authenticationService: AuthenticationService,
    private messageService: MessageService,
    private sharedService: SharedService
  ) {
    const storage = this.sharedService.getStorage();
    if (storage) {
      if (storage['formValue'] !== undefined && storage['formValue'] !== null && storage['isFromMathsPracticeTest'] !== null && storage['isFromMathsPracticeTest'] === true) {
        this.formValue = storage['formValue'];
        this.isFromMathsPracticeTest = true;
        this.isFromJumbleMathsTest = false;
      }
      if (storage['isFromMathsPracticeTest'] !== null && storage['isFromMathsPracticeTest'] === false) {
        this.isFromMathsPracticeTest = false;
        this.allSatQuestions = storage['satData'];
        this.isFromJumbleMathsTest = false;
      }
      if (storage['isFromJumbleMathsTest'] !== null && storage['isFromMathsPracticeTest'] === false && storage['isFromJumbleMathsTest'] === true) {
        this.isFromJumbleMathsTest = true;
        this.allSatQuestions = storage['satData'];
      }
    }

    console.log(this.isFromJumbleMathsTest);

    this.sharedService.clearStorage();
  }

  ngOnInit() {
    this.startDate = new Date();
    // Once student reload the browser directly it will navigate to login page
    this.browserRefresh = browserRefresh;
    if (this.browserRefresh) {
      this.router.navigate(["/login"]);
    }

    this.preventReloadBrowser();
    this.preventBackButton();
    this.reportQuestionForm = this.fb.group({
      Description: new FormControl('', Validators.required),
    });

    this.user = this.authenticationService.userValue;
    this.getNonCalcQuestions();
  }
  // Define a function to handle back button and use anywhere
  preventBackButton() {
    history.pushState(null, null, location.href);
    this.locationStrategy.onPopState(() => {
      history.pushState(null, null, location.href);
    })
  }

  preventReloadBrowser() {
    window.addEventListener("beforeunload", function (e) {
      var confirmationMessage =
        "You have unsaved data changes. Are you sure to close the page?";
      // this.confirm();
      e.returnValue = confirmationMessage;
      return confirmationMessage;
    });
    // prevent refresh button in angular code starts here
    window.addEventListener("keyup", disableF5);
    window.addEventListener("keydown", disableF5);

    function disableF5(e) {
      if ((e.which || e.keyCode) == 116) e.preventDefault();
    }
    // prevent refresh button in angular code ends here
  }

  getNonCalcQuestions() {
    this.startingMinutes = 25;
    if (this.formValue !== undefined && this.formValue !== null && this.isFromMathsPracticeTest) {
      let topicId = this.formValue.value.TopicId;
      const subTopicId = this.formValue.value.SubTopicId;
      // const subTopicIds = subTopicId.toString();
      this.adminCommonEndpointsService
        .getQuestionsList(this.user.UserId, '1', topicId, '2', subTopicId, '0')
        .subscribe((res) => {
          this.allSatQuestions = res;
          this.nonCalcQuestions = this.allSatQuestions;
          this.combinedArray = [...this.nonCalcQuestions];
          this.combinedArray.map(x => {
            x['Id'] = 0;
            x['SelectedAnswer'] = null;
            x['UnAnswered'] = 0;
          });
          this.nonCalcpager.count = this.nonCalcQuestions.length;
        });
      this.leftTime = this.startingMinutes * 60;
      this.displayMinutes = 0;
      this.displaySeconds = 0;
      this.onNonCalcCountDownTime();
    }

    // sat exam non calc questions
    if (this.isFromMathsPracticeTest === false) {
      this.nonCalcQuestions = this.allSatQuestions;
      this.combinedArray = [...this.nonCalcQuestions];
      this.combinedArray.map(x => {
        x['Id'] = 0;
        x['UnAnswered'] = 0;
        x['SelectedAnswer'] = null;
      });
      this.nonCalcpager.count = this.nonCalcQuestions.length;
      this.leftTime = this.startingMinutes * 60;
      this.displayMinutes = 0;
      this.displaySeconds = 0;
      this.onNonCalcCountDownTime();
    }

    // Jumble test exam non calc questions
    if (this.isFromJumbleMathsTest) {
      this.nonCalcQuestions = this.allSatQuestions;
      this.combinedArray = [...this.nonCalcQuestions];
      this.combinedArray.map(x => {
        x['Id'] = 0;
        x['UnAnswered'] = 0;
        x['SelectedAnswer'] = null;
      });
      this.nonCalcpager.count = this.nonCalcQuestions.length;
      this.leftTime = this.startingMinutes * 60;
      this.displayMinutes = 0;
      this.displaySeconds = 0;
      this.onNonCalcCountDownTime();
    }
  }

  onNonCalcCountDownTime() {
    this.interval = setInterval(() => {
      if (this.leftTime >= 0) {
        this.displayMinutes = Math.floor(this.leftTime / 60);
        this.displaySeconds = Math.floor(this.leftTime % 60);
        this.leftTime--;
        this.elapsedTime = this.startingMinutes - this.displayMinutes;
        if (this.leftTime === 0 && this.isBreakTime === false) {
          this.isBreakTime = true;
          this.startingMinutes = 1;
          this.page = 0;
          this.nonCalcpager.count = 0;
          this.leftTime = this.startingMinutes * 60;
          this.displayMinutes = 0;
          this.displaySeconds = 0;
          clearInterval(this.interval);
          this.loadBreakCountDownTime();
        }
      }
    }, 1000);
  }

  loadBreakCountDownTime() {
    this.interval = setInterval(() => {
      if (this.leftTime >= 0) {
        this.displayMinutes = Math.floor(this.leftTime / 60);
        this.displaySeconds = Math.floor(this.leftTime % 60);
        this.leftTime--;
      }

      if (this.leftTime === 0 && this.isBreakTime === true) {
        this.isBreakTime = false;
        this.loadCalcSectQuestionsData();
      }
    }, 2000);
  }

  loadCalcCountDownTime() {
    clearInterval(this.interval);
    this.interval = setInterval(() => {
      if (this.leftTime >= 0) {
        this.displayMinutes = Math.floor(this.leftTime / 60);
        this.displaySeconds = Math.floor(this.leftTime % 60);
        this.leftTime--;

        if (this.leftTime === 0 && this.isBreakTime === false) {
          this.endExam();
        }
      }
    }, 6000);
  }

  loadCalcSectQuestionsData() {
    // clearInterval(this.interval);
    this.startingMinutes = 55;
    // calc questions for practice test 
    if (this.formValue !== undefined && this.formValue !== null && this.isFromMathsPracticeTest) {
      let topicId = this.formValue.value.TopicId;
      const subTopicId = this.formValue.value.SubTopicId;
      const subTopicIds = subTopicId.toString();
      this.adminCommonEndpointsService
        .getQuestionsList(this.user.UserId, '1', topicId, '1', subTopicIds, '0')
        .subscribe((res) => {
          this.allSatQuestions = res;
          this.calcQuestions = this.allSatQuestions.filter(
            (x) => x.CalculatorId === 1
          );
          this.combinedArray = [...this.calcQuestions];
          this.combinedArray.map(x => {
            x['Id'] = 0;
            x['SelectedAnswer'] = null;
            x['UnAnswered'] = 0;
          });
          this.calcpager.count = this.calcQuestions.length;
        });
      this.leftTime = this.startingMinutes * 60;
      this.loadCalcCountDownTime();
    }

    // Calc Questions for sat exam
    if (this.isFromMathsPracticeTest === false && this.isFromJumbleMathsTest === false) {
      this.studentCommonEndpointsService.getSATExamQuestionsList(this.user.UserId, '1', this.user.BatchIds, 1)
        .subscribe((res) => {
          this.allSatQuestions = res;
          this.calcQuestions = this.allSatQuestions.filter(
            (x) => x.CalculatorId === 1
          );
          this.combinedArray = [...this.calcQuestions];
          this.combinedArray.map(x => {
            x['Id'] = 0;
            x['SelectedAnswer'] = null;
            x['UnAnswered'] = 0;
          });
          this.calcpager.count = this.calcQuestions.length;
        });
      this.leftTime = this.startingMinutes * 60;
      this.loadCalcCountDownTime();
    }
    // Calc Questions for Jumbled exam
    if (this.isFromJumbleMathsTest) {
      this.studentCommonEndpointsService.getSATExamJumbleMathsQuestionsList(this.user.UserId, '1', this.user.BatchIds, 1)
        .subscribe((res) => {
          this.allSatQuestions = res;
          this.calcQuestions = this.allSatQuestions.filter(
            (x) => x.CalculatorId === 1
          );
          this.combinedArray = [...this.calcQuestions];
          this.combinedArray.map(x => {
            x['Id'] = 0;
            x['SelectedAnswer'] = null;
            x['UnAnswered'] = 0;
          });
          this.calcpager.count = this.calcQuestions.length;
        });
      this.leftTime = this.startingMinutes * 60;
      this.loadCalcCountDownTime();
    }
  }

  // set index to non-calc section items
  setNonCalcPageIndex(i, qstn) {
    this.isOptionSelectedHideSkipQstn = true;
    // Below code is used to check question is multiple choice or grid in
    if (qstn.GridId.toString() === '2') {
      this.isShowMultipleChoiceHeader = true;
    } else {
      this.isShowMultipleChoiceHeader = false;
    }

    // hide skip question sec
    if ((this.page + 1) === this.nonCalcpager.count) {
      this.isOptionSelectedHideSkipQstn = false;
    }

    // if (this.isFromMathsPracticeTest === true) {
    if (i >= 0 && i < this.nonCalcpager.count) {
      // Call api to save un-answered questions data
      if (qstn.SelectedAnswer === null) {
        if (this.isFromJumbleMathsTest) {
          this.loadUnansweredJumbleTestAPI(qstn);
        } else {
          if (this.isFromMathsPracticeTest === true) {
            this.loadUnansweredPracticeTestAPI(qstn);
          } else {
            this.loadUnansweredSatAPI(qstn);
          }
        }
      }
      this.nonCalcpager.index = i;
      this.nonCalcCurrentPageIndex = i;
      this.page = i;
    }
    // As per requirement, below code is commented. It  is used to disable previous question indexes...
    //  } else {
    //   if (this.page < i && i >= 0 && i < this.nonCalcpager.count) {
    //     // Call api to save un-answered questions data
    //     if (qstn.SelectedAnswer === null) {
    //       this.loadUnansweredSatAPI(qstn);
    //   }
    //     this.nonCalcpager.index = i;
    //     this.nonCalcCurrentPageIndex = i;
    //     this.page = i;
    //   }
    //  }
  }

  // set index to calc section items
  setCalcPageIndex(i, qstn) {
    this.isOptionSelectedHideSkipQstn = true;
    // Below code is used to check question is multiple choice or grid in
    if (qstn.GridId.toString() === '2') {
      this.isShowMultipleChoiceHeader = true;
    } else {
      this.isShowMultipleChoiceHeader = false;
    }

    // if (this.isFromMathsPracticeTest === true) {
    if (i >= 0 && i < this.calcpager.count) {
      // Call api to save un-answered questions data
      if (this.isFromJumbleMathsTest) {
        this.loadUnansweredJumbleTestAPI(qstn);
      } else {
        if (qstn.SelectedAnswer === null) {
          if (this.isFromMathsPracticeTest === true) {
            this.loadUnansweredPracticeTestAPI(qstn);
          } else {
            this.loadUnansweredSatAPI(qstn);
          }
        }
      }
      this.calcpager.index = i;
      this.calcCurrentPageIndex = i;
      this.page = i;
    }

    // hide skip question sec
    if ((this.page + 1) === this.nonCalcpager.count) {
      this.isOptionSelectedHideSkipQstn = false;
    }
    // }

    // As per requirement, below code is commented. It  is used to disable previous question indexes...
    //  else {
    //   if (this.page < i && i >= 0 && i < this.calcpager.count) {
    //       // Call api to save un-answered questions data
    //       if (qstn.SelectedAnswer === null) {
    //           this.loadUnansweredSatAPI(qstn);
    //       }
    //       this.calcpager.index = i;
    //       this.calcCurrentPageIndex = i;
    //       this.page = i;
    //   }
    // }

  }

  onSubmitGridInQuestion(qstn, i) {
    this.isOptionSelectedHideSkipQstn = true;
    // Below code is used to check question is multiple choice or grid in
    if (qstn.GridId.toString() === '2') {
      this.isShowMultipleChoiceHeader = true;
    } else {
      this.isShowMultipleChoiceHeader = false;
    }

    if (qstn.CalculatorId === constants.nonCalculatorId) {
      if (this.page < this.nonCalcpager.count) {
        if (
          this.nonCalcCurrentPageIndex >= 0 &&
          this.nonCalcCurrentPageIndex <= this.nonCalcpager.count
        ) {
          this.nonCalcpager.index = i + 1;
          this.nonCalcCurrentPageIndex = i + 1;
          if (this.nonCalcCurrentPageIndex === this.nonCalcpager.count) {
            this.nonCalcCurrentPageIndex = i;
          }
          this.page++;
        }
      }

      // Call api to save grid-in questions data
      if (this.examTestComponent.correctVal !== undefined && this.examTestComponent.correctVal !== null) {
        if (this.isFromJumbleMathsTest) {
          this.loadAddUpdateJumbleTestApi(qstn);
        } else {
          if (this.isFromMathsPracticeTest === true) {
            this.loadAddUpdatePracticeTestApi(qstn);
          } else {
            this.loadAddUpdateSatTestApi(qstn);
          }
        }
      }

      // Call api to save un-answered questions data
      if (qstn.SelectedAnswer === null) {
        if (this.isFromJumbleMathsTest) {
          this.loadUnansweredJumbleTestAPI(qstn);
        } else {
          if (this.isFromMathsPracticeTest === true) {
            this.loadUnansweredPracticeTestAPI(qstn);
          } else {
            this.loadUnansweredSatAPI(qstn);
          }
        }
      }

      // hide skip question sec
      if ((this.page + 1) === this.nonCalcpager.count) {
        this.isOptionSelectedHideSkipQstn = false;
      }

      // below code is used to show break time once if non-calc section is completed...
      if (this.page === this.nonCalcpager.count &&
        this.page !== this.calcpager.count) {
        if (this.isFromMathsPracticeTest || this.isFromJumbleMathsTest) {
          this.unSelectedQuestionsNonCalcCount = this.combinedArray.filter(
            (x) => (x && (Number(x.UnAnswered) === 1 || Number(x.UnAnswered) === 0) && (x.SelectedAnswer === null || Number(x.SelectedAnswer) === 0))
          ).length;
          if (this.unSelectedQuestionsNonCalcCount > 0) {
            this.page = 0;
            this.modalService.open(this.nonCalcWarningMessage, {
              size: 'lg',
              windowClass: 'confirm-dialog-window',
              centered: true,
              backdrop: 'static',
              keyboard: false,
            });
          }
          if (this.unSelectedQuestionsNonCalcCount === 0) {
            this.startingMinutes = 10;
            this.isBreakTime = true;
            this.page = 0;
            this.nonCalcpager.count = 0;
            this.leftTime = this.startingMinutes * 60;
            this.displayMinutes = 0;
            this.displaySeconds = 0;
            this.loadBreakCountDownTime();
          }
        } else {
          this.startingMinutes = 10;
          this.isBreakTime = true;
          this.page = 0;
          this.nonCalcpager.count = 0;
          this.leftTime = this.startingMinutes * 60;
          this.displayMinutes = 0;
          this.displaySeconds = 0;
          this.loadBreakCountDownTime();
        }
      }
    }

    // Below code is used to check the calc questions indexes...
    if (qstn.CalculatorId === constants.CalculatorId) {
      if (this.page < this.calcpager.count) {
        if (
          this.calcCurrentPageIndex >= 0 &&
          this.calcCurrentPageIndex <= this.calcpager.count
        ) {
          this.calcpager.index = i + 1;
          this.calcCurrentPageIndex = i + 1;
          if (this.calcCurrentPageIndex === this.calcpager.count) {
            this.calcCurrentPageIndex = i;
          }
          this.page++;
        }
      }

      // Call api to save grid-in questions data
      if (this.examTestComponent.correctVal !== undefined && this.examTestComponent.correctVal !== null) {
        if (this.isFromJumbleMathsTest) {
          this.loadAddUpdateJumbleTestApi(qstn);
        } else {
          if (this.isFromMathsPracticeTest === true) {
            this.loadAddUpdatePracticeTestApi(qstn);
          } else {
            this.loadAddUpdateSatTestApi(qstn);
          }
        }
      }

      // Call api to save un-answered questions data
      if (qstn.SelectedAnswer === null) {
        if (this.isFromJumbleMathsTest) {
          this.loadUnansweredJumbleTestAPI(qstn);
        } else {
          if (this.isFromMathsPracticeTest === true) {
            this.loadUnansweredPracticeTestAPI(qstn);
          } else {
            this.loadUnansweredSatAPI(qstn);
          }
        }
      }

      // hide skip question sec
      if ((this.page + 1) === this.calcpager.count) {
        this.isOptionSelectedHideSkipQstn = false;
      }

      if (this.page === this.calcpager.count && this.page !== 1) {
        if (this.isFromMathsPracticeTest || this.isFromJumbleMathsTest) {
          this.unSelectedQuestionsCalcCount = this.combinedArray.filter(
            (x) => (x && (Number(x.UnAnswered) === 1 || Number(x.UnAnswered) === 0) && (x.SelectedAnswer === null || Number(x.SelectedAnswer) === 0))
          ).length;
          if (this.unSelectedQuestionsCalcCount > 0) {
            this.page--;
            this.modalService.open(this.calcWarningMessage, {
              size: 'lg',
              windowClass: 'confirm-dialog-window',
              centered: true,
              backdrop: 'static',
              keyboard: false,
            });
          }
          if (this.unSelectedQuestionsCalcCount === 0) {
            this.page--;
            this.endExam();
          }
          // add logic to end exam
        } else {
          this.page--;
          this.endExam();
        }
      }
    }
  }

  nextQuestion(qstn, i) {
    this.isOptionSelectedHideSkipQstn = true;
    // Below code is used to check question is multiple choice or grid in
    if (qstn.GridId.toString() === '2') {
      this.isShowMultipleChoiceHeader = true;
    } else {
      this.isShowMultipleChoiceHeader = false;
    }
    // checking non calc section
    if (qstn.CalculatorId === constants.nonCalculatorId) {
      if (this.page < this.nonCalcpager.count) {
        if (
          this.nonCalcCurrentPageIndex >= 0 &&
          this.nonCalcCurrentPageIndex <= this.nonCalcpager.count
        ) {
          // Call api to save un-answered questions data
          if (qstn.SelectedAnswer === null) {
            if (this.isFromJumbleMathsTest) {
              this.loadUnansweredJumbleTestAPI(qstn);
            } else {
              if (this.isFromMathsPracticeTest === true) {
                this.loadUnansweredPracticeTestAPI(qstn);
              } else {
                this.loadUnansweredSatAPI(qstn);
              }
            }
          }
          this.nonCalcpager.index = i + 1;
          this.nonCalcCurrentPageIndex = i + 1;
          this.page++;
        }
      }
    }

    // Below code is used to check the calc questions indexes...
    if (qstn.CalculatorId === constants.CalculatorId) {
      if (this.page < this.calcpager.count) {
        if (
          this.calcCurrentPageIndex >= 0 &&
          this.calcCurrentPageIndex <= this.calcpager.count
        ) {
          // Call api to save un-answered questions data
          if (qstn.SelectedAnswer === null) {
            if (this.isFromJumbleMathsTest) {
              this.loadUnansweredJumbleTestAPI(qstn);
            } else {
              if (this.isFromMathsPracticeTest === true) {
                this.loadUnansweredPracticeTestAPI(qstn);
              } else {
                this.loadUnansweredSatAPI(qstn);
              }
            }
          }
          this.calcpager.index = i + 1;
          this.calcCurrentPageIndex = i + 1;
          this.page++;
        }
      }
    }
  }

  endNonCalcSectionMessage() {
    this.unSelectedQuestionsNonCalcCount = 0;
    this.startingMinutes = 10;
    this.isBreakTime = true;
    this.page = 0;
    this.nonCalcpager.count = 0;
    this.leftTime = this.startingMinutes * 60;
    this.displayMinutes = 0;
    this.displaySeconds = 0;
    this.loadBreakCountDownTime();
    this.modalService.dismissAll();
  }

  closeCalcSectionWarningPopup() {
    this.endExam();
    this.modalService.dismissAll();
  }

  cancelNavigateToCalcSection() {
    this.modalService.dismissAll();
  }

  skipQuestion(question, i) {
    this.spinnerService.show();
    if (question.CalculatorId === constants.nonCalculatorId) {
      if (this.nonCalcCurrentPageIndex >= 0 &&
        this.calcCurrentPageIndex <= this.nonCalcpager.count) {
        this.nonCalcpager.index = i + 1;
        this.nonCalcCurrentPageIndex = i + 1;
        this.page++;
      }
    }

    // hide skip question non-calc sec
    if ((this.page + 1) === this.nonCalcpager.count) {
      this.isOptionSelectedHideSkipQstn = false;
    }

    // hide skip question calc sec
    if ((this.page + 1) === this.calcpager.count) {
      this.isOptionSelectedHideSkipQstn = false;
    }

    // Below code is used to check the calc questions indexes...
    if (question.CalculatorId === constants.CalculatorId) {
      if (this.page < this.calcpager.count) {
        if (
          this.calcCurrentPageIndex >= 0 &&
          this.calcCurrentPageIndex <= this.calcpager.count
        ) {
          this.calcpager.index = i + 1;
          this.calcCurrentPageIndex = i + 1;
          this.page++;
        }
      }
    }
    // Call api to save Skipped questions data
    if (question.SelectedAnswer === null) {
      if (this.isFromJumbleMathsTest) {
        this.loadAddUpdateSkippedJumbleTestApi(question);
      } else {
        if (this.isFromMathsPracticeTest === true) {
          this.loadAddUpdateSkippedPracticeTestApi(question);
        } else {
          this.loadAddUpdateSkippedSatTestApi(question);
        }
      }
    }
  }

  showCalcSection() {
    this.spinnerService.show();
    this.isBreakTime = false;
    this.loadCalcSectQuestionsData();
    this.spinnerService.hide();
    this.page = 0;
  }

  endThisExam() {
    this.modalService.open(this.endExamWarningMessage, {
      size: "lg",
      windowClass: "confirm-dialog-window",
      centered: true,
      backdrop: "static",
      keyboard: false,
    });
  }

  endExam() {
    this.spinnerService.show();
    if (this.page < this.calcpager.count || this.page < this.nonCalcpager.count || this.page === 0) {

      // if user does not select any questions
      this.combinedArray.forEach(x => {
        if (x.SelectedAnswer === null) {
          if (this.isFromJumbleMathsTest) {
            this.loadUnansweredJumbleTestAPI(x);
          } else {
            if (this.isFromMathsPracticeTest === true) {
              this.loadUnansweredPracticeTestAPI(x);
            } else {
              this.loadUnansweredSatAPI(x);
            }
          }
        }
      });

      if (this.isFromJumbleMathsTest) {
        this.studentCommonEndpointsService.getSATTestJumblePichart(this.user.UserId).toPromise().then(result => {
          this.sharedService.setStorage({ pieChartReport: result, isFromPracticeTest: true });
          this.spinnerService.hide();
          this.router.navigate(["/user/exam"]);
        }, e => {
          this.messageService.add({ severity: 'error', summary: 'Error in ending', detail: '' });
        });
      } else {
        if (this.isFromMathsPracticeTest) {
          this.studentCommonEndpointsService.getPracticerTestExamReport(this.user.UserId).toPromise().then(result => {
            this.sharedService.setStorage({ pieChartReport: result, isFromPracticeTest: true });
            this.spinnerService.hide();
            this.router.navigate(["/user/exam"]);
          }, e => {
            this.messageService.add({ severity: 'error', summary: 'Error in ending', detail: '' });
          });
        } else {
          this.studentCommonEndpointsService.getSATTestReportReport(this.user.UserId).toPromise().then(result => {
            this.sharedService.setStorage({ pieChartReport: result, isFromSATExam: true });
            this.router.navigate(["/user/exam"]);
          }, e => {
            this.messageService.add({ severity: 'error', summary: 'Error in ending', detail: '' });
          });
        }
      }
    }
    this.modalService.dismissAll();
    // this.spinnerService.hide();
  }

  onSelectedAnswer(question) {
    this.spinnerService.show();
    this.isOptionSelectedHideSkipQstn = false;
    if (this.isFromJumbleMathsTest) {
      this.loadAddUpdateJumbleTestApi(question);
    } else {
      if (this.isFromMathsPracticeTest === true) {
        this.loadAddUpdatePracticeTestApi(question);
      } else {
        this.loadAddUpdateSatTestApi(question);
      }
    }

  }

  loadAddUpdatePracticeTestApi(question) {
    let selectedOptval;
    if (this.examTestComponent.correctVal !== undefined && this.examTestComponent.correctVal !== null) {
      selectedOptval = this.examTestComponent.correctVal;
    } else {
      selectedOptval = question.SelectedAnswer;
    }
    var endDate;
    if (this.page !== 1 && this.page === this.calcpager.count) {
      endDate = new Date();
    } else {
      endDate = null;
    }
    if (question.Id !== undefined && Number(question.Id) !== 0) {
      const addExam: IAddExam = {
        Id: question.Id,
        ExamId: question.ExamId,
        StudentId: this.user.UserId,
        QuestionId: question.QuestionId,
        SelectedAnswer: selectedOptval,
        Skipped: 0,
        Answered: 1,
        Startdate: this.datePipe.transform(this.startDate, 'MM/dd/yy h:mm:ss a'),
        EndDate: this.datePipe.transform(endDate, 'MM/dd/yy h:mm:ss a')
      };

      this.studentCommonEndpointsService.updateExam(addExam).subscribe(res => {
        this.combinedArray.map(x => {
          if (x.QuestionId === question.QuestionId) {
            x['Id'] = res.Id;
            x['ExamId'] = res.ExamId;
            x['SelectedAnswer'] = res.SelectedAnswer;
          }
        });
        this.spinnerService.hide();
      }, (e) => {
        this.spinnerService.hide();
      });
    } else {
      const addExam: IAddExam = {
        ExamId: studentTestEnum.PracticeTest,
        StudentId: this.user.UserId,
        QuestionId: question.QuestionId,
        SelectedAnswer: selectedOptval,
        Skipped: 0,
        Answered: 1,
        Startdate: this.datePipe.transform(this.startDate, 'MM/dd/yy h:mm:ss a'),
        EndDate: this.datePipe.transform(endDate, 'MM/dd/yy h:mm:ss a')
      };

      this.studentCommonEndpointsService.addExam(addExam).subscribe(res => {
        this.combinedArray.map(x => {
          if (x.QuestionId === question.QuestionId) {
            x['Id'] = res.Id;
            x['ExamId'] = res.ExamId;
            x['SelectedAnswer'] = res.SelectedAnswer;
          }
        });
        this.spinnerService.hide();
      }, (e) => {
        this.spinnerService.hide();
      });
    }
  }

  loadAddUpdateSatTestApi(question) {
    let selectedOptval;
    if (this.examTestComponent.correctVal !== undefined && this.examTestComponent.correctVal !== null) {
      selectedOptval = this.examTestComponent.correctVal;
    } else {
      selectedOptval = question.SelectedAnswer;
    }
    var endDate;
    if (this.page !== 1 && this.page === this.calcpager.count) {
      endDate = new Date();
    } else {
      endDate = null;
    }
    if (question.Id !== undefined && Number(question.Id) !== 0) {
      const addExam: IAddExam = {
        Id: question.Id,
        ExamId: question.ExamId,
        StudentId: this.user.UserId,
        QuestionId: question.QuestionId,
        SelectedAnswer: selectedOptval,
        Skipped: 0,
        Answered: 1,
        Startdate: this.datePipe.transform(this.startDate, 'MM/dd/yy h:mm:ss a'),
        EndDate: this.datePipe.transform(endDate, 'MM/dd/yy h:mm:ss a')
      };

      this.studentCommonEndpointsService.updateSatExam(addExam).subscribe(res => {
        this.combinedArray.map(x => {
          if (x.QuestionId === question.QuestionId) {
            x['Id'] = res.Id;
            x['ExamId'] = res.ExamId;
            x['SelectedAnswer'] = res.SelectedAnswer;
          }
        });
        this.spinnerService.hide();
      }, (e) => {
        this.spinnerService.hide();
      });
    } else {
      const addExam: IAddExam = {
        ExamId: studentTestEnum.SatTest,
        StudentId: this.user.UserId,
        QuestionId: question.QuestionId,
        SelectedAnswer: selectedOptval,
        Skipped: 0,
        Answered: 1,
        Startdate: this.datePipe.transform(this.startDate, 'MM/dd/yy h:mm:ss a'),
        EndDate: this.datePipe.transform(endDate, 'MM/dd/yy h:mm:ss a')
      };

      this.studentCommonEndpointsService.addSatExam(addExam).subscribe(res => {
        this.combinedArray.map(x => {
          if (x.QuestionId === question.QuestionId) {
            x['Id'] = res.Id;
            x['ExamId'] = res.ExamId;
            x['SelectedAnswer'] = res.SelectedAnswer;
          }
        });
        this.spinnerService.hide();
      }, (e) => {
        this.spinnerService.hide();
      });
    }
  }

  loadAddUpdateSkippedPracticeTestApi(question) {
    var endDate;
    if (this.page !== 1 && this.page === this.calcpager.count) {
      endDate = new Date();
    } else {
      endDate = null;
    }
    if (question.Id !== undefined && Number(question.Id) !== 0) {
      const addExam: IAddExam = {
        Id: question.Id,
        StudentId: this.user.UserId,
        QuestionId: question.QuestionId,
        ExamId: question.ExamId,
        SelectedAnswer: 0,
        Skipped: 1,
        Answered: 0,
        Startdate: this.datePipe.transform(this.startDate, 'MM/dd/yy h:mm:ss a'),
        EndDate: this.datePipe.transform(endDate, 'MM/dd/yy h:mm:ss a')
      };

      this.studentCommonEndpointsService.updateExam(addExam).subscribe(res => {
        this.combinedArray.map(x => {
          if (x.QuestionId === question.QuestionId) {
            x['Id'] = res.Id;
            x['ExamId'] = res.ExamId;
            x['SelectedAnswer'] = res.SelectedAnswer;
          }
        });
        this.spinnerService.hide();
      }, (e) => {
        this.spinnerService.hide();
      });
    } else {
      const addExam: IAddExam = {
        Id: question.Id,
        StudentId: this.user.UserId,
        QuestionId: question.QuestionId,
        ExamId: question.ExamId,
        SelectedAnswer: 0,
        Skipped: 1,
        Answered: 0,
        Startdate: this.datePipe.transform(this.startDate, 'MM/dd/yy h:mm:ss a'),
        EndDate: this.datePipe.transform(endDate, 'MM/dd/yy h:mm:ss a')
      };

      this.studentCommonEndpointsService.addExam(addExam).subscribe(res => {
        this.combinedArray.map(x => {
          if (x.QuestionId === question.QuestionId) {
            x['Id'] = res.Id;
            x['ExamId'] = res.ExamId;
            x['SelectedAnswer'] = res.SelectedAnswer;
          }
        });
        this.spinnerService.hide();
      }, (e) => {
        this.spinnerService.hide();
      });
    }
  }

  loadAddUpdateSkippedSatTestApi(question) {
    var endDate;
    if (this.page !== 1 && this.page === this.calcpager.count) {
      endDate = new Date();
    } else {
      endDate = null;
    }
    if (question.Id !== undefined && Number(question.Id) !== 0) {
      const addExam: IAddExam = {
        Id: question.Id,
        StudentId: this.user.UserId,
        QuestionId: question.QuestionId,
        ExamId: question.ExamId,
        SelectedAnswer: 0,
        Skipped: 1,
        Answered: 0,
        Startdate: this.datePipe.transform(this.startDate, 'MM/dd/yy h:mm:ss a'),
        EndDate: this.datePipe.transform(endDate, 'MM/dd/yy h:mm:ss a')
      };

      this.studentCommonEndpointsService.updateSatExam(addExam).subscribe(res => {
        this.combinedArray.map(x => {
          if (x.QuestionId === question.QuestionId) {
            x['Id'] = res.Id;
            x['ExamId'] = res.ExamId;
            x['SelectedAnswer'] = res.SelectedAnswer;
          }
        });
        this.spinnerService.hide();
      }, (e) => {
        this.spinnerService.hide();
      });
    } else {
      const addExam: IAddExam = {
        Id: question.Id,
        StudentId: this.user.UserId,
        QuestionId: question.QuestionId,
        ExamId: question.ExamId,
        SelectedAnswer: 0,
        Skipped: 1,
        Answered: 0,
        Startdate: this.datePipe.transform(this.startDate, 'MM/dd/yy h:mm:ss a'),
        EndDate: this.datePipe.transform(endDate, 'MM/dd/yy h:mm:ss a')
      };

      this.studentCommonEndpointsService.addSatExam(addExam).subscribe(res => {
        this.combinedArray.map(x => {
          if (x.QuestionId === question.QuestionId) {
            x['Id'] = res.Id;
            x['ExamId'] = res.ExamId;
            x['SelectedAnswer'] = res.SelectedAnswer;
          }
        });
        this.spinnerService.hide();
      }, (e) => {
        this.spinnerService.hide();
      });
      this.spinnerService.hide();
    }
  }

  // un-answered questions
  loadUnansweredPracticeTestAPI(question) {
    var endDate;
    if (this.page !== 1 && this.page === this.calcpager.count) {
      endDate = new Date();
    } else {
      endDate = null;
    }
    if (question.Id !== undefined && Number(question.Id) !== 0) {
      const addExam: IAddExam = {
        Id: question.Id,
        ExamId: question.ExamId,
        StudentId: this.user.UserId,
        QuestionId: question.QuestionId,
        SelectedAnswer: 0,
        Skipped: 0,
        Answered: 0,
        UnAnswered: 1,
        Startdate: this.datePipe.transform(this.startDate, 'MM/dd/yy h:mm:ss a'),
        EndDate: this.datePipe.transform(endDate, 'MM/dd/yy h:mm:ss a')
      };

      this.studentCommonEndpointsService.updateExam(addExam).subscribe(res => {
        this.combinedArray.map(x => {
          if (x.QuestionId === question.QuestionId) {
            x['Id'] = res.Id;
            x['ExamId'] = res.ExamId;
            x['SelectedAnswer'] = res.SelectedAnswer;
          }
        });
        this.spinnerService.hide();
      }, (e) => {
        this.spinnerService.hide();
      });
    } else {
      const addExam: IAddExam = {
        ExamId: studentTestEnum.PracticeTest,
        StudentId: this.user.UserId,
        QuestionId: question.QuestionId,
        SelectedAnswer: 0,
        Skipped: 0,
        Answered: 0,
        UnAnswered: 1,
        Startdate: this.datePipe.transform(this.startDate, 'MM/dd/yy h:mm:ss a'),
        EndDate: this.datePipe.transform(endDate, 'MM/dd/yy h:mm:ss a')
      };

      this.studentCommonEndpointsService.addExam(addExam).subscribe(res => {
        this.combinedArray.map(x => {
          if (x.QuestionId === question.QuestionId) {
            x['Id'] = res.Id;
            x['ExamId'] = res.ExamId;
            x['SelectedAnswer'] = res.SelectedAnswer;
          }
        });
        this.spinnerService.hide();
      }, (e) => {
        this.spinnerService.hide();
      });
    }
  }

  // un-answered questions
  loadUnansweredSatAPI(question) {
    var endDate;
    if (this.page !== 1 && this.page === this.calcpager.count) {
      endDate = new Date();
    } else {
      endDate = null;
    }

    if (question.Id !== undefined && Number(question.Id) !== 0) {
      const addExam: IAddExam = {
        Id: question.Id,
        ExamId: question.ExamId,
        StudentId: this.user.UserId,
        QuestionId: question.QuestionId,
        SelectedAnswer: 0,
        Skipped: 0,
        Answered: 0,
        UnAnswered: 1,
        Startdate: this.datePipe.transform(this.startDate, 'MM/dd/yy h:mm:ss a'),
        EndDate: this.datePipe.transform(endDate, 'MM/dd/yy h:mm:ss a')
      };

      this.studentCommonEndpointsService.updateSatExam(addExam).subscribe(res => {
        this.combinedArray.map(x => {
          if (x.QuestionId === question.QuestionId) {
            x['Id'] = res.Id;
            x['ExamId'] = res.ExamId;
            x['SelectedAnswer'] = res.SelectedAnswer;
          }
        });
        this.spinnerService.hide();
      }, (e) => {
        this.spinnerService.hide();
      });
    } else {
      const addExam: IAddExam = {
        ExamId: question.ExamId,
        StudentId: this.user.UserId,
        QuestionId: question.QuestionId,
        SelectedAnswer: 0,
        Skipped: 0,
        Answered: 0,
        UnAnswered: 1,
        Startdate: this.datePipe.transform(this.startDate, 'MM/dd/yy h:mm:ss a'),
        EndDate: this.datePipe.transform(endDate, 'MM/dd/yy h:mm:ss a')
      };

      this.studentCommonEndpointsService.addSatExam(addExam).subscribe(res => {
        this.combinedArray.map(x => {
          if (x.QuestionId === question.QuestionId) {
            x['Id'] = res.Id;
            x['ExamId'] = res.ExamId;
            x['SelectedAnswer'] = res.SelectedAnswer;
          }
        });
        this.spinnerService.hide();
      }, (e) => {
        this.spinnerService.hide();
      });
    }
  }

  // jumble test api's code starts here
  loadAddUpdateJumbleTestApi(question) {
    let selectedOptval;
    if (this.examTestComponent.correctVal !== undefined && this.examTestComponent.correctVal !== null) {
      selectedOptval = this.examTestComponent.correctVal;
    } else {
      selectedOptval = question.SelectedAnswer;
    }
    var endDate;
    if (this.page !== 1 && this.page === this.calcpager.count) {
      endDate = new Date();
    } else {
      endDate = null;
    }
    if (question.Id !== undefined && Number(question.Id) !== 0) {
      const addExam: IAddExam = {
        Id: question.Id,
        ExamId: question.ExamId,
        StudentId: this.user.UserId,
        QuestionId: question.QuestionId,
        SelectedAnswer: selectedOptval,
        Skipped: 0,
        Answered: 1,
        Startdate: this.datePipe.transform(this.startDate, 'MM/dd/yy h:mm:ss a'),
        EndDate: this.datePipe.transform(endDate, 'MM/dd/yy h:mm:ss a')
      };

      this.studentCommonEndpointsService.updateSATJumbleMaths(addExam).subscribe(res => {
        this.combinedArray.map(x => {
          if (x.QuestionId === question.QuestionId) {
            x['Id'] = res.Id;
            x['ExamId'] = res.ExamId;
            x['SelectedAnswer'] = res.SelectedAnswer;
          }
        });
        this.spinnerService.hide();
      }, (e) => {
        this.spinnerService.hide();
      });
    } else {
      const addExam: IAddExam = {
        ExamId: studentTestEnum.PracticeTest,
        StudentId: this.user.UserId,
        QuestionId: question.QuestionId,
        SelectedAnswer: selectedOptval,
        Skipped: 0,
        Answered: 1,
        Startdate: this.datePipe.transform(this.startDate, 'MM/dd/yy h:mm:ss a'),
        EndDate: this.datePipe.transform(endDate, 'MM/dd/yy h:mm:ss a')
      };

      this.studentCommonEndpointsService.addSATJumbleMaths(addExam).subscribe(res => {
        this.combinedArray.map(x => {
          if (x.QuestionId === question.QuestionId) {
            x['Id'] = res.Id;
            x['ExamId'] = res.ExamId;
            x['SelectedAnswer'] = res.SelectedAnswer;
          }
        });
        this.spinnerService.hide();
      }, (e) => {
        this.spinnerService.hide();
      });
    }
  }

  loadAddUpdateSkippedJumbleTestApi(question) {
    var endDate;
    if (this.page !== 1 && this.page === this.calcpager.count) {
      endDate = new Date();
    } else {
      endDate = null;
    }
    if (question.Id !== undefined && Number(question.Id) !== 0) {
      const addExam: IAddExam = {
        Id: question.Id,
        StudentId: this.user.UserId,
        QuestionId: question.QuestionId,
        ExamId: question.ExamId,
        SelectedAnswer: 0,
        Skipped: 1,
        Answered: 0,
        Startdate: this.datePipe.transform(this.startDate, 'MM/dd/yy h:mm:ss a'),
        EndDate: this.datePipe.transform(endDate, 'MM/dd/yy h:mm:ss a')
      };

      this.studentCommonEndpointsService.updateSATJumbleMaths(addExam).subscribe(res => {
        this.combinedArray.map(x => {
          if (x.QuestionId === question.QuestionId) {
            x['Id'] = res.Id;
            x['ExamId'] = res.ExamId;
            x['SelectedAnswer'] = res.SelectedAnswer;
          }
        });
        this.spinnerService.hide();
      }, (e) => {
        this.spinnerService.hide();
      });
    } else {
      const addExam: IAddExam = {
        Id: question.Id,
        StudentId: this.user.UserId,
        QuestionId: question.QuestionId,
        ExamId: question.ExamId,
        SelectedAnswer: 0,
        Skipped: 1,
        Answered: 0,
        Startdate: this.datePipe.transform(this.startDate, 'MM/dd/yy h:mm:ss a'),
        EndDate: this.datePipe.transform(endDate, 'MM/dd/yy h:mm:ss a')
      };

      this.studentCommonEndpointsService.addSATJumbleMaths(addExam).subscribe(res => {
        this.combinedArray.map(x => {
          if (x.QuestionId === question.QuestionId) {
            x['Id'] = res.Id;
            x['ExamId'] = res.ExamId;
            x['SelectedAnswer'] = res.SelectedAnswer;
          }
        });
        this.spinnerService.hide();
      }, (e) => {
        this.spinnerService.hide();
      });
    }
  }

  loadUnansweredJumbleTestAPI(question) {
    var endDate;
    if (this.page !== 1 && this.page === this.calcpager.count) {
      endDate = new Date();
    } else {
      endDate = null;
    }
    if (question.Id !== undefined && Number(question.Id) !== 0) {
      const addExam: IAddExam = {
        Id: question.Id,
        ExamId: question.ExamId,
        StudentId: this.user.UserId,
        QuestionId: question.QuestionId,
        SelectedAnswer: 0,
        Skipped: 0,
        Answered: 0,
        UnAnswered: 1,
        Startdate: this.datePipe.transform(this.startDate, 'MM/dd/yy h:mm:ss a'),
        EndDate: this.datePipe.transform(endDate, 'MM/dd/yy h:mm:ss a')
      };

      this.studentCommonEndpointsService.updateSATJumbleMaths(addExam).subscribe(res => {
        this.combinedArray.map(x => {
          if (x.QuestionId === question.QuestionId) {
            x['Id'] = res.Id;
            x['ExamId'] = res.ExamId;
            x['SelectedAnswer'] = res.SelectedAnswer;
          }
        });
        this.spinnerService.hide();
      }, (e) => {
        this.spinnerService.hide();
      });
    } else {
      const addExam: IAddExam = {
        ExamId: studentTestEnum.PracticeTest,
        StudentId: this.user.UserId,
        QuestionId: question.QuestionId,
        SelectedAnswer: 0,
        Skipped: 0,
        Answered: 0,
        UnAnswered: 1,
        Startdate: this.datePipe.transform(this.startDate, 'MM/dd/yy h:mm:ss a'),
        EndDate: this.datePipe.transform(endDate, 'MM/dd/yy h:mm:ss a')
      };

      this.studentCommonEndpointsService.addSATJumbleMaths(addExam).subscribe(res => {
        this.combinedArray.map(x => {
          if (x.QuestionId === question.QuestionId) {
            x['Id'] = res.Id;
            x['ExamId'] = res.ExamId;
            x['SelectedAnswer'] = res.SelectedAnswer;
          }
        });
        this.spinnerService.hide();
      }, (e) => {
        this.spinnerService.hide();
      });
    }
  }
  // jumble test api's code ends here

  issueQuestion: any;
  reportQuestion(question: any) {
    this.issueQuestion = question;
    this.modalService.open(this.reportInvalidQuestion, {
      size: "lg",
      windowClass: "confirm-dialog-window",
      centered: true,
      backdrop: "static",
      keyboard: false,
    });
  }

  cancelReportQuestionDiaouge() {
    this.reportQuestionForm.reset();
    this.modalService.dismissAll();
  }

  reportIssue() {
    const reportIssueQuestion: IAdminTableParams = {
      Table: 'IssueReport',
      FilterFieldName: 'QuestionId',
      FilterFieldValue: this.issueQuestion.QuestionId,
      Data: [
        {
          FieldName: 'QuestionId',
          FieldValue: this.issueQuestion.QuestionId
        },
        {
          FieldName: 'Description',
          FieldValue: this.reportQuestionForm.get('Description').value
        },
        {
          FieldName: 'ExamId',
          FieldValue: this.issueQuestion.ExamId
        },
        {
          FieldName: 'BatchId',
          FieldValue: this.user.BatchIds
        },
        // {
        //   FieldName: 'BatchIds',
        //   FieldValue: this.user.BatchIds
        // },
        {
          FieldName: 'UserId',
          FieldValue: this.user.UserId
        },
        {
          FieldName: 'Createdby',
          FieldValue: this.user.Name
        },
        {
          FieldName: 'UpdatedBy',
          FieldValue: this.user.Name
        }
      ]
    };
    this.adminCommonEndpointsService.addNewList(reportIssueQuestion).toPromise().then((result) => {
      // this.messageService.add({severity: 'success', summary: 'Question reported successfully', detail: ''});
      this.modalService.dismissAll();
      this.reportQuestionForm.reset();
      this.spinnerService.hide();
    }, (e) => {
      this.messageService.add({ severity: 'error', summary: 'Error while reporting', detail: '' });
      this.reportQuestionForm.reset();
      this.modalService.dismissAll();
    });
  }

  reportFormValid() {
    return this.reportQuestionForm.valid;
  }

  getTimeByCalculatorId(id: number) {
    if (id) {
      return id === constants.CalculatorId ? "55 mins" : "25 mins";
    }
  }
}
