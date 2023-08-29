import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { MessageService } from 'primeng/api';
import { constants } from 'src/app/constants';
import { DataProvider } from 'src/app/helpers/providers/data.provider';
import { studentTestEnum } from 'src/app/models/Enum/student-test';
import { User } from 'src/app/models/interfaces';
import { IAddExam } from 'src/app/models/interfaces/add-exam';
import { AdminCommonEndpointsService } from 'src/app/services/admin-common-endpoints.service';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { StudentCommonEndpointsService } from 'src/app/services/student-common-endpoints.service';

@Component({
  selector: 'app-english-homework-test',
  templateUrl: './english-homework-test.component.html',
  styleUrls: ['./english-homework-test.component.scss']
})
export class EnglishHomeworkTestComponent implements OnInit {

  constants = constants; // set here so that it's available on html template
  totalReocrds: number;
  page: number = 0;
  selectedHomeworkData: any;
  user: User;
  homeWork: any[] = [];

  readingSecCurrentIndex: number = 0;
  writtingSecCurrentIndex: number = 0;


  constructor(private spinnerService: NgxSpinnerService,
              private messageService: MessageService,
              private dataProvider: DataProvider,
              private authenticationService: AuthenticationService,
              private router: Router,
              private adminCommonEndpointsService: AdminCommonEndpointsService,
              private studentCommonEndpointsService: StudentCommonEndpointsService) {
                if (this.dataProvider.storage) {
                  this.selectedHomeworkData = this.dataProvider.storage['selectedHomeworkData'];
                }
                this.user = this.authenticationService.userValue;
               }

  ngOnInit() {
    this.refreshData();
  }

  refreshData() {
    this.spinnerService.show();
    this.homeWork = this.selectedHomeworkData;
    this.totalReocrds = this.homeWork.length;
    this.spinnerService.hide();
  }

  
  selectCorrectAnswer(optionId, question, i) {
    this.spinnerService.show();
    const date = new Date();
    if (question.Id !== undefined && Number(question.Id) !== 0) {
      const addExam: IAddExam = {
        Id: question.Id,
        ExamId: studentTestEnum.HomeworkTest,
        StudentId: this.user.UserId,
        QuestionId: question.QuestionId,
        SelectedAnswer: (i + 1),
        Skipped: 0,
        Answered: 1,
        Startdate: JSON.parse(JSON.stringify(date)),
        EndDate: JSON.parse(JSON.stringify(date))
      };
  
      this.studentCommonEndpointsService.updateEnglishHomeWork(addExam).subscribe(res => {
        this.homeWork.map(x => {
          if (x.QuestionId === question.QuestionId) {
            x['Id'] = res.Id;
            x['selectedOption'] = optionId;
          } else {
            x['Id'] = 0;
          }
        });
       this.spinnerService.hide();
      }, (e) => {
        this.spinnerService.hide();
      });
    } else {
      const addExam: IAddExam = {
        ExamId: studentTestEnum.HomeworkTest,
        StudentId: this.user.UserId,
        QuestionId: question.QuestionId,
        SelectedAnswer: (i + 1),
        Skipped: 0,
        Answered: 1,
        Startdate: JSON.parse(JSON.stringify(date)),
        EndDate: JSON.parse(JSON.stringify(date))
      };
  
      this.studentCommonEndpointsService.addEnglishHomework(addExam).subscribe(res => {
        this.homeWork.map(x => {
          if (x.QuestionId === question.QuestionId) {
            x['Id'] = res.Id;
            x['selectedOption'] = optionId;
          } else {
            x['Id'] = 0;
          }
        });
       this.spinnerService.hide();
      }, (e) => {
        this.messageService.add({severity: 'error', summary: 'Error in adding', detail: ''});
        this.spinnerService.hide();
      });
    }

  }

  // prev and next button code starts here
  nextQuestion(index) {
    if ((index + 1) < this.homeWork.length) {
      this.page = index + 1;
    }

    if ((index + 1) === this.homeWork.length) {
      // this.studentCommonEndpointsService.sendEmailForTestDetails(this.user.BatchId, this.user.UserId, this.user.UserName, 'Homework').subscribe(res => {
      // });
      this.messageService.add({severity: 'success', summary: 'Homework submitted successfully...!', detail: ''});
      this.dataProvider.storage = { 
        isShowMessage: true };
      this.router.navigate(['/user/tuition/home-work']);
    }
  }

  prevQuestion(index) {
    if (index > 0) {
      this.page = index - 1;
    } else {
      this.page = 0;
    }
  }

}
