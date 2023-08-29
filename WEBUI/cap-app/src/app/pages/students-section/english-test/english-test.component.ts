import { DatePipe, LocationStrategy } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ViewChild } from '@angular/core';
import { Component, ElementRef, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { ConfirmationService, MessageService } from 'primeng/api';
import { constants } from 'src/app/constants';
import { SharedService } from 'src/app/helpers/providers/shared.service';
import { studentTestEnum } from 'src/app/models/Enum/student-test';
import { browserRefresh } from 'src/app/app.component';
import { User } from 'src/app/models/interfaces';
import { IAddExam } from 'src/app/models/interfaces/add-exam';
import { IPracticeTest } from 'src/app/models/interfaces/exam-details.model';
import { AdminCommonEndpointsService } from 'src/app/services/admin-common-endpoints.service';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { StudentCommonEndpointsService } from 'src/app/services/student-common-endpoints.service';

@Component({
  selector: 'app-english-test',
  templateUrl: './english-test.component.html',
  styleUrls: ['./english-test.component.scss']
})
export class EnglishTestComponent implements OnInit {

  public browserRefresh: boolean;

  @ViewChild('readingSectionWarningMessage') readingSectionWarningMessage: ElementRef;
  @ViewChild('writtingSectionWarningMessage') writtingSectionWarningMessage: ElementRef;
  @ViewChild('endExamWarningMessage') endExamWarningMessage: ElementRef;
  @ViewChild('endExamConfirmation') endExamConfirmation: ElementRef;
  constants = constants; // set here so that it's available on html template

  totalReocrds: number;
  page: number = 0;
  user: User;
  englishData: any;

  isShowBreakTime = false;

  interval: any;
  isBreakTime = false;
  displayMinutes: number = 0;
  displaySeconds: number = 0;
  elapsedTime: number = 0;
  isOptionSelectedHideSkipQstn: boolean = false;

  readingSecCurrentIndex: number = 0;
  writtingSecCurrentIndex: number = 0;
  readingSectionPager = {
    index: 0,
    size: 1,
    count: 1,
  };

  writtingAndLanguagePager = {
    index: 0,
    size: 1,
    count: 1,
  };

  readingSecQuestions: any[] = [];
  writtingSecQuestions: any[] = [];

  // new code added here
  allSatQuestions: IPracticeTest[] = [];
  combinedArray: any[] = [];

  // count down timer code
  startingMinutes: number = 10;
  displayCountDownTime: number = 0;
  leftTime: number = 1;
  unansweredReadingSectionCount: number = 0;
  unansweredWrittingSectionCount: number = 0;

  breakTime: number = 10;
  isShowMultipleChoiceHeader: boolean = true;

  formValue: any;
  isFromEnglishPracticeTest: boolean = true;
  isFromJumbleMathsTest: boolean = false;
  startDate: Date;
  datePipe = new DatePipe('en-US');

  constructor(
    private router: Router,
    private adminCommonEndpointsService: AdminCommonEndpointsService,
    private studentCommonEndpointsService: StudentCommonEndpointsService,
    private spinnerService: NgxSpinnerService,
    private modalService: NgbModal,
    private locationStrategy: LocationStrategy,
    private confirmationService: ConfirmationService,
    private authenticationService: AuthenticationService,
    private messageService: MessageService,
    private sharedService: SharedService
  ) {
    const storage = this.sharedService.getStorage();
    if (storage) {
      if (storage['formValue'] !== undefined && storage['formValue'] !== null && storage['isFromEnglishPracticeTest'] !== null && storage['isFromEnglishPracticeTest'] === true) {
        this.formValue = storage['formValue'];
        this.isFromEnglishPracticeTest = true;
        this.isFromJumbleMathsTest = false;
      }
      if (storage['isFromEnglishPracticeTest'] !== null && storage['isFromEnglishPracticeTest'] === false) {
        this.isFromEnglishPracticeTest = false;
        this.isFromJumbleMathsTest = false;
        this.allSatQuestions = storage['satData'];
      }
      if (storage['isFromJumbleMathsTest'] !== null && storage['isFromJumbleMathsTest'] === true) {
        this.isFromJumbleMathsTest = true;
        this.allSatQuestions = storage['satData'];
      }
    }

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

    this.user = this.authenticationService.userValue;
    this.getReadingSecQuestions();
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


  getReadingSecQuestions() {
    this.startingMinutes = 65;
    if (this.formValue !== undefined && this.formValue !== null && this.isFromEnglishPracticeTest) {
      let topicId = this.formValue.value.TopicId;
      const subTopicId = this.formValue.value.SubTopicId;
      // const subTopicIds = subTopicId.toString();
      this.adminCommonEndpointsService
        .getEnglishQuestionsList(this.user.UserId, 2, topicId, '1', subTopicId, '0')
        .subscribe((res) => {
          this.allSatQuestions = res;
          this.readingSecQuestions = this.allSatQuestions;
          this.combinedArray = [...this.readingSecQuestions];
          this.combinedArray.map(x => {
            x['Id'] = 0;
            x['SelectedAnswer'] = null;
            x['UnAnswered'] = 0;
          });
          this.readingSectionPager.count = this.readingSecQuestions.length;
        });
      this.leftTime = this.startingMinutes * 60;
      this.displayMinutes = 0;
      this.displaySeconds = 0;
      this.onReadingSecCountDownTime();
    }

    // sat exam non calc questions
    if (this.isFromEnglishPracticeTest === false) {
      this.readingSecQuestions = this.allSatQuestions;
      this.combinedArray = [...this.readingSecQuestions];
      this.combinedArray.map(x => {
        x['Id'] = 0;
        x['UnAnswered'] = 0;
        x['SelectedAnswer'] = null;
      });
      this.readingSectionPager.count = this.readingSecQuestions.length;
      this.leftTime = this.startingMinutes * 60;
      this.displayMinutes = 0;
      this.displaySeconds = 0;
      this.onReadingSecCountDownTime();
    }

    // Jumble test non calc questions
    if (this.isFromJumbleMathsTest) {
      this.readingSecQuestions = this.allSatQuestions;
      this.combinedArray = [...this.readingSecQuestions];
      this.combinedArray.map(x => {
        x['Id'] = 0;
        x['UnAnswered'] = 0;
        x['SelectedAnswer'] = null;
      });
      this.readingSectionPager.count = this.readingSecQuestions.length;
      this.leftTime = this.startingMinutes * 60;
      this.displayMinutes = 0;
      this.displaySeconds = 0;
      this.onReadingSecCountDownTime();
    }
  }

  onReadingSecCountDownTime() {
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
          this.readingSectionPager.count = 0;
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
        this.loadWrittingSectionQuestionsData();
      }
    }, 2000);
  }

  loadCalcCountDownTime() {
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

  loadWrittingSectionQuestionsData() {
    clearInterval(this.interval);
    this.startingMinutes = 35;
    // reading section questions for practice test 
    if (this.formValue !== undefined && this.formValue !== null && this.isFromEnglishPracticeTest) {
      let topicId = this.formValue.value.TopicId;
      const subTopicId = this.formValue.value.SubTopicId;
      const subTopicIds = subTopicId.toString();
      this.adminCommonEndpointsService
        .getEnglishQuestionsList(this.user.UserId, 2, topicId, '2', subTopicIds, '0')
        .subscribe((res) => {
          this.allSatQuestions = res;
          this.writtingSecQuestions = this.allSatQuestions.filter(
            (x) => Number(x['EnglishSectionId']) === constants.WritingAndLanguageId
          );
          this.combinedArray = [...this.writtingSecQuestions];
          this.combinedArray.map(x => {
            x['Id'] = 0;
            x['SelectedAnswer'] = null;
            x['UnAnswered'] = 0;
          });
          this.writtingAndLanguagePager.count = this.writtingSecQuestions.length;
        });
      this.leftTime = this.startingMinutes * 60;
      this.loadCalcCountDownTime();
    }

    // Calc Questions for sat exam
    if (this.isFromEnglishPracticeTest === false && this.isFromJumbleMathsTest === false) {
      this.studentCommonEndpointsService.getSATExamEnglishQuestionsList(this.user.UserId, 2, this.user.BatchIds, 2)
        .subscribe((res) => {
          this.allSatQuestions = res;
          this.writtingSecQuestions = this.allSatQuestions.filter(
            (x) => Number(x['EnglishSectionId']) === constants.WritingAndLanguageId
          );
          this.combinedArray = [...this.writtingSecQuestions];
          this.combinedArray.map(x => {
            x['Id'] = 0;
            x['SelectedAnswer'] = null;
            x['UnAnswered'] = 0;
          });
          this.writtingAndLanguagePager.count = this.writtingSecQuestions.length;
        });
      this.leftTime = this.startingMinutes * 60;
      this.loadCalcCountDownTime();
    }

    // Jumble test calc Questions for sat exam
    if (this.isFromJumbleMathsTest) {
      this.studentCommonEndpointsService.getSATExamJumbleEnglishQuestionsList(this.user.UserId, 2, this.user.BatchIds, 2)
        .subscribe((res) => {
          this.allSatQuestions = res;
          this.writtingSecQuestions = this.allSatQuestions.filter(
            (x) => Number(x['EnglishSectionId']) === constants.WritingAndLanguageId
          );
          this.combinedArray = [...this.writtingSecQuestions];
          this.combinedArray.map(x => {
            x['Id'] = 0;
            x['SelectedAnswer'] = null;
            x['UnAnswered'] = 0;
          });
          this.writtingAndLanguagePager.count = this.writtingSecQuestions.length;
        });
      this.leftTime = this.startingMinutes * 60;
      this.loadCalcCountDownTime();
    }
  }

  // set index to reading section items
  setReadingPageIndex(i, qstn) {
    this.isOptionSelectedHideSkipQstn = true;

    // hide skip question sec
    if ((this.page + 1) === this.readingSectionPager.count) {
      this.isOptionSelectedHideSkipQstn = false;
    }

    // if (this.isFromEnglishPracticeTest === true) {
    if (i >= 0 && i < this.readingSectionPager.count) {
      // Call api to save un-answered questions data
      if (qstn.SelectedAnswer === null) {
        if (this.isFromJumbleMathsTest) {
          this.loadUnansweredJumbleTestAPI(qstn);
        } else {
          if (this.isFromEnglishPracticeTest === true) {
            this.loadUnansweredPracticeTestAPI(qstn);
          } else {
            this.loadUnansweredSatAPI(qstn);
          }
        }
      }
      this.readingSectionPager.index = i;
      this.readingSecCurrentIndex = i;
      this.page = i;
    }
    // As per requirement, below code is commented. It  is used to disable previous question indexes...
    //  } else {
    //   if (this.page < i && i >= 0 && i < this.readingSectionPager.count) {
    //     // Call api to save un-answered questions data
    //     if (qstn.SelectedAnswer === null) {
    //       this.loadUnansweredSatAPI(qstn);
    //   }
    //     this.readingSectionPager.index = i;
    //     this.readingSecCurrentIndex = i;
    //     this.page = i;
    //   }
    //  }
  }

  // set index to writting section items
  setWrittingPageIndex(i, qstn) {
    this.isOptionSelectedHideSkipQstn = true;

    // if (this.isFromEnglishPracticeTest === true) {
    if (i >= 0 && i < this.writtingAndLanguagePager.count) {
      // Call api to save un-answered questions data
      if (qstn.SelectedAnswer === null) {
        if (this.isFromJumbleMathsTest) {
          this.loadUnansweredJumbleTestAPI(qstn);
        } else {
          if (this.isFromEnglishPracticeTest === true) {
            this.loadUnansweredPracticeTestAPI(qstn);
          } else {
            this.loadUnansweredSatAPI(qstn);
          }
        }
      }
      this.writtingAndLanguagePager.index = i;
      this.writtingSecCurrentIndex = i;
      this.page = i;
    }

    // hide skip question sec
    if ((this.page + 1) === this.readingSectionPager.count) {
      this.isOptionSelectedHideSkipQstn = false;
    }
    // }

    // As per requirement, below code is commented. It  is used to disable previous question indexes...
    //  else {
    //   if (this.page < i && i >= 0 && i < this.writtingAndLanguagePager.count) {
    //       // Call api to save un-answered questions data
    //       if (qstn.SelectedAnswer === null) {
    //           this.loadUnansweredSatAPI(qstn);
    //       }
    //       this.writtingAndLanguagePager.index = i;
    //       this.writtingSecCurrentIndex = i;
    //       this.page = i;
    //   }
    // }

  }

  nextQuestion(qstn, i) {
    this.isOptionSelectedHideSkipQstn = true;

    if (Number(qstn.EnglishSectionId) === Number(constants.ReadingId)) {
      if (this.page < this.readingSectionPager.count) {
        if (
          this.readingSecCurrentIndex >= 0 &&
          this.readingSecCurrentIndex <= this.readingSectionPager.count
        ) {
          this.readingSectionPager.index = i + 1;
          this.readingSecCurrentIndex = i + 1;
          if (this.readingSecCurrentIndex === this.readingSectionPager.count) {
            this.readingSecCurrentIndex = i;
          }
          this.page++;
        }
      }

      // Call api to save grid-in questions data
      if (qstn.SelectedAnswer === null) {
        if (this.isFromJumbleMathsTest) {
          this.loadAddUpdateJumbleTestApi(qstn, qstn.SelectedAnswer);
        } else {
          if (this.isFromEnglishPracticeTest === true) {
            this.loadAddUpdatePracticeTestApi(qstn, qstn.SelectedAnswer);
          } else {
            this.loadAddUpdateSatTestApi(qstn, qstn.SelectedAnswer);
          }
        }
      }

      // Call api to save un-answered questions data
      if (qstn.SelectedAnswer === null) {
        if (this.isFromJumbleMathsTest) {
          this.loadUnansweredJumbleTestAPI(qstn);
        } else {
          if (this.isFromEnglishPracticeTest === true) {
            this.loadUnansweredPracticeTestAPI(qstn);
          } else {
            this.loadUnansweredSatAPI(qstn);
          }
        }
      }

      // hide skip question sec
      if ((this.page + 1) === this.readingSectionPager.count) {
        this.isOptionSelectedHideSkipQstn = false;
      }

      // below code is used to show break time once if non-calc section is completed...
      if (this.page === this.readingSectionPager.count &&
        this.page !== this.writtingAndLanguagePager.count) {
        if (this.isFromEnglishPracticeTest || this.isFromJumbleMathsTest) {
          this.unansweredReadingSectionCount = this.combinedArray.filter(
            (x) => (x && (Number(x.UnAnswered) === 1 || Number(x.UnAnswered) === 0) && (x.SelectedAnswer === null || Number(x.SelectedAnswer) === 0))
          ).length;
          if (this.unansweredReadingSectionCount > 0) {
            this.page = 0;
            this.modalService.open(this.readingSectionWarningMessage, {
              size: 'lg',
              windowClass: 'confirm-dialog-window',
              centered: true,
              backdrop: 'static',
              keyboard: false,
            });
          }
          if (this.unansweredReadingSectionCount === 0) {
            this.startingMinutes = 10;
            this.isBreakTime = true;
            this.page = 0;
            this.readingSectionPager.count = 0;
            this.leftTime = this.startingMinutes * 60;
            this.displayMinutes = 0;
            this.displaySeconds = 0;
            this.loadBreakCountDownTime();
          }
        } else {
          this.startingMinutes = 10;
          this.isBreakTime = true;
          this.page = 0;
          this.readingSectionPager.count = 0;
          this.leftTime = this.startingMinutes * 60;
          this.displayMinutes = 0;
          this.displaySeconds = 0;
          this.loadBreakCountDownTime();
        }
      }
    }

    // Below code is used to check the calc questions indexes...
    if (qstn.EnglishSectionId === constants.WritingAndLanguageId) {
      if (this.page < this.writtingAndLanguagePager.count) {
        if (
          this.writtingSecCurrentIndex >= 0 &&
          this.writtingSecCurrentIndex <= this.writtingAndLanguagePager.count
        ) {
          this.writtingAndLanguagePager.index = i + 1;
          this.writtingSecCurrentIndex = i + 1;
          if (this.writtingSecCurrentIndex === this.writtingAndLanguagePager.count) {
            this.writtingSecCurrentIndex = i;
          }
          this.page++;
        }
      }

      // Call api to save un-answered questions data
      if (qstn.SelectedAnswer === null) {
        if (this.isFromJumbleMathsTest) {
          this.loadUnansweredJumbleTestAPI(qstn);
        } else {
          if (this.isFromEnglishPracticeTest === true) {
            this.loadUnansweredPracticeTestAPI(qstn);
          } else {
            this.loadUnansweredSatAPI(qstn);
          }
        }
      }

      // hide skip question sec
      if ((this.page + 1) === this.writtingAndLanguagePager.count) {
        this.isOptionSelectedHideSkipQstn = false;
      }

      if (this.page === this.writtingAndLanguagePager.count && this.page !== 1) {
        if (this.isFromEnglishPracticeTest || this.isFromJumbleMathsTest) {
          this.unansweredWrittingSectionCount = this.combinedArray.filter(
            (x) => (x && (Number(x.UnAnswered) === 1 || Number(x.UnAnswered) === 0) && (x.SelectedAnswer === null || Number(x.SelectedAnswer) === 0))
          ).length;
          if (this.unansweredWrittingSectionCount > 0) {
            this.page--;
            this.modalService.open(this.writtingSectionWarningMessage, {
              size: 'lg',
              windowClass: 'confirm-dialog-window',
              centered: true,
              backdrop: 'static',
              keyboard: false,
            });
          }
          if (this.unansweredWrittingSectionCount === 0) {
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

  endNonCalcSectionMessage() {
    this.unansweredReadingSectionCount = 0;
    this.startingMinutes = 10;
    this.isBreakTime = true;
    this.page = 0;
    this.readingSectionPager.count = 0;
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
    if (question.EnglishSectionId === constants.ReadingId) {
      if (this.readingSecCurrentIndex >= 0 &&
        this.writtingSecCurrentIndex <= this.readingSectionPager.count) {
        this.readingSectionPager.index = i + 1;
        this.readingSecCurrentIndex = i + 1;
        this.page++;
      }
    }

    // hide skip question non-calc sec
    if ((this.page + 1) === this.readingSectionPager.count) {
      this.isOptionSelectedHideSkipQstn = false;
    }

    // hide skip question calc sec
    if ((this.page + 1) === this.writtingAndLanguagePager.count) {
      this.isOptionSelectedHideSkipQstn = false;
    }

    // Below code is used to check the calc questions indexes...
    if (question.EnglishSectionId === constants.WritingAndLanguageId) {
      if (this.page < this.writtingAndLanguagePager.count) {
        if (
          this.writtingSecCurrentIndex >= 0 &&
          this.writtingSecCurrentIndex <= this.writtingAndLanguagePager.count
        ) {
          this.writtingAndLanguagePager.index = i + 1;
          this.writtingSecCurrentIndex = i + 1;
          this.page++;
        }
      }
    }
    // Call api to save Skipped questions data
    if (question.SelectedAnswer === null) {
      if (this.isFromJumbleMathsTest) {
        this.loadAddUpdateSkippedJumbleTestApi(question);
      } else {
        if (this.isFromEnglishPracticeTest === true) {
          this.loadAddUpdateSkippedPracticeTestApi(question);
        } else {
          this.loadAddUpdateSkippedSatTestApi(question);
        }
      }
    }
  }

  skipBreakAndGoToNextSection() {
    this.spinnerService.show();
    this.isBreakTime = false;
    this.loadWrittingSectionQuestionsData();
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
    if (this.page < this.writtingAndLanguagePager.count || this.page < this.readingSectionPager.count || this.page === 0) {

      // if user does not select any questions
      this.combinedArray.forEach(x => {
        if (x.SelectedAnswer === null) {
          if (this.isFromJumbleMathsTest) {
            this.loadUnansweredJumbleTestAPI(x);
          } else {
            if (this.isFromEnglishPracticeTest === true) {
              this.loadUnansweredPracticeTestAPI(x);
            } else {
              this.loadUnansweredSatAPI(x);
            }
          }
        }
      });

      if (this.isFromJumbleMathsTest) {
        this.studentCommonEndpointsService.getSATJumbleEnglishPichartReport(this.user.UserId).toPromise().then(result => {
          this.sharedService.setStorage({ pieChartReport: result, isFromEnglishPracticeTest: true, isFromEnglishSubject: true });
          this.spinnerService.hide();
          this.router.navigate(["/user/exam"]);
        }, e => {
          this.messageService.add({ severity: 'error', summary: 'Error in ending', detail: '' });
        });
      } else {
        if (this.isFromEnglishPracticeTest) {
          this.studentCommonEndpointsService.getPracticeEnglishExamReport(this.user.UserId).toPromise().then(result => {
            this.sharedService.setStorage({ pieChartReport: result, isFromEnglishPracticeTest: true, isFromEnglishSubject: true });
            this.spinnerService.hide();
            this.router.navigate(["/user/exam"]);
          }, e => {
            this.messageService.add({ severity: 'error', summary: 'Error in ending', detail: '' });
          });
        } else {
          this.studentCommonEndpointsService.getSATEnglishPichartReport(this.user.UserId).toPromise().then(result => {
            this.sharedService.setStorage({ pieChartReport: result, isFromEnglishSATExam: true, isFromEnglishSubject: true });
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

  onSelectedAnswer(selectedOpt, question) {
    this.spinnerService.show();
    this.isOptionSelectedHideSkipQstn = false;
    if (this.isFromJumbleMathsTest) {
      this.loadAddUpdateJumbleTestApi(question, selectedOpt);
    } else {
      if (this.isFromEnglishPracticeTest === true) {
        this.loadAddUpdatePracticeTestApi(question, selectedOpt);
      } else {
        this.loadAddUpdateSatTestApi(question, selectedOpt);
      }
    }

  }

  // Calling Api mehtods code starts here
  loadAddUpdatePracticeTestApi(question, selectedOpt) {
    var endDate;
    if (this.page !== 1 && this.page === this.writtingAndLanguagePager.count) {
      endDate = new Date();
    } else {
      endDate = null;
    }
    var selectedOpt;
    if (selectedOpt === null) {
      selectedOpt = 0;
    } else {
      selectedOpt = selectedOpt;
    }
    if (question.Id !== undefined && Number(question.Id) !== 0) {
      const addExam: IAddExam = {
        Id: question.Id,
        ExamId: question.ExamId,
        StudentId: this.user.UserId,
        QuestionId: question.QuestionId,
        SelectedAnswer: selectedOpt,
        Skipped: 0,
        Answered: 1,
        Startdate: this.datePipe.transform(this.startDate, 'MM/dd/yy h:mm:ss a'),
        EndDate: this.datePipe.transform(endDate, 'MM/dd/yy h:mm:ss a')
      };

      this.studentCommonEndpointsService.updateEnglishExam(addExam).subscribe(res => {
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
        SelectedAnswer: selectedOpt,
        Skipped: 0,
        Answered: 1,
        Startdate: this.datePipe.transform(this.startDate, 'MM/dd/yy h:mm:ss a'),
        EndDate: this.datePipe.transform(endDate, 'MM/dd/yy h:mm:ss a')
      };

      this.studentCommonEndpointsService.addEnglishExam(addExam).subscribe(res => {
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

  loadAddUpdateSatTestApi(question, selectedOpt) {
    var endDate;
    if (this.page !== 1 && this.page === this.writtingAndLanguagePager.count) {
      endDate = new Date();
    } else {
      endDate = null;
    }
    var selectedOpt;
    if (selectedOpt === null) {
      selectedOpt = 0;
    } else {
      selectedOpt = selectedOpt;
    }
    if (question.Id !== undefined && Number(question.Id) !== 0) {
      const addExam: IAddExam = {
        Id: question.Id,
        ExamId: question.ExamId,
        StudentId: this.user.UserId,
        QuestionId: question.QuestionId,
        SelectedAnswer: selectedOpt,
        Skipped: 0,
        Answered: 1,
        Startdate: this.datePipe.transform(this.startDate, 'MM/dd/yy h:mm:ss a'),
        EndDate: this.datePipe.transform(endDate, 'MM/dd/yy h:mm:ss a')
      };

      this.studentCommonEndpointsService.updateEnglishSAT(addExam).subscribe(res => {
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
        SelectedAnswer: selectedOpt,
        Skipped: 0,
        Answered: 1,
        Startdate: this.datePipe.transform(this.startDate, 'MM/dd/yy h:mm:ss a'),
        EndDate: this.datePipe.transform(endDate, 'MM/dd/yy h:mm:ss a')
      };

      this.studentCommonEndpointsService.addEnglishSATTest(addExam).subscribe(res => {
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
    if (this.page !== 1 && this.page === this.writtingAndLanguagePager.count) {
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

      this.studentCommonEndpointsService.updateEnglishExam(addExam).subscribe(res => {
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

      this.studentCommonEndpointsService.addEnglishExam(addExam).subscribe(res => {
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
    if (this.page !== 1 && this.page === this.writtingAndLanguagePager.count) {
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

      this.studentCommonEndpointsService.updateEnglishSAT(addExam).subscribe(res => {
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

      this.studentCommonEndpointsService.addEnglishSATTest(addExam).subscribe(res => {
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
    if (this.page !== 1 && this.page === this.writtingAndLanguagePager.count) {
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

      this.studentCommonEndpointsService.updateEnglishExam(addExam).subscribe(res => {
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

      this.studentCommonEndpointsService.addEnglishExam(addExam).subscribe(res => {
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
    if (this.page !== 1 && this.page === this.writtingAndLanguagePager.count) {
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

      this.studentCommonEndpointsService.updateSATJumbleEnglish(addExam).subscribe(res => {
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

      this.studentCommonEndpointsService.addSATJumbleEnglish(addExam).subscribe(res => {
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

  // Jumble Test API's code starts here
  loadAddUpdateJumbleTestApi(question, selectedOpt) {
    var endDate;
    if (this.page !== 1 && this.page === this.writtingAndLanguagePager.count) {
      endDate = new Date();
    } else {
      endDate = null;
    }
    var selectedOpt;
    if (selectedOpt === null) {
      selectedOpt = 0;
    } else {
      selectedOpt = selectedOpt;
    }
    if (question.Id !== undefined && Number(question.Id) !== 0) {
      const addExam: IAddExam = {
        Id: question.Id,
        ExamId: question.ExamId,
        StudentId: this.user.UserId,
        QuestionId: question.QuestionId,
        SelectedAnswer: selectedOpt,
        Skipped: 0,
        Answered: 1,
        Startdate: this.datePipe.transform(this.startDate, 'MM/dd/yy h:mm:ss a'),
        EndDate: this.datePipe.transform(endDate, 'MM/dd/yy h:mm:ss a')
      };

      this.studentCommonEndpointsService.updateEnglishExam(addExam).subscribe(res => {
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
        SelectedAnswer: selectedOpt,
        Skipped: 0,
        Answered: 1,
        Startdate: this.datePipe.transform(this.startDate, 'MM/dd/yy h:mm:ss a'),
        EndDate: this.datePipe.transform(endDate, 'MM/dd/yy h:mm:ss a')
      };

      this.studentCommonEndpointsService.addSATJumbleEnglish(addExam).subscribe(res => {
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
    if (this.page !== 1 && this.page === this.writtingAndLanguagePager.count) {
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

      this.studentCommonEndpointsService.updateSATJumbleEnglish(addExam).subscribe(res => {
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

      this.studentCommonEndpointsService.addSATJumbleEnglish(addExam).subscribe(res => {
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
  loadUnansweredJumbleTestAPI(question) {
    var endDate;
    if (this.page !== 1 && this.page === this.writtingAndLanguagePager.count) {
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

      this.studentCommonEndpointsService.updateSATJumbleEnglish(addExam).subscribe(res => {
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

      this.studentCommonEndpointsService.addSATJumbleEnglish(addExam).subscribe(res => {
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
  // Jumble Test API's code ends here

  getTimeBySectionId(id: number) {
    if (id) {
      return id === constants.ReadingId ? '65 mins' : '35 mins';
    }
  }

}
