import { studentTestEnum } from './../../../../models/Enum/student-test';
import { SubjectsEnum } from './../../../../models/Enum/subjects';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { DataProvider } from 'src/app/helpers/providers/data.provider';
import { User } from 'src/app/models/interfaces';
import { AdminCommonEndpointsService } from 'src/app/services/admin-common-endpoints.service';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { StudentCommonEndpointsService } from 'src/app/services/student-common-endpoints.service';
import { IAdminTableParams } from 'src/app/models/interfaces/admin-table';
import { IAddExamId } from 'src/app/models/interfaces/add-exam';

@Component({
  selector: 'app-home-work',
  templateUrl: './home-work.component.html',
  styleUrls: ['./home-work.component.scss']
})
export class HomeWorkComponent implements OnInit {

  page: number = 0;
  homeworkForm: FormGroup;
  topics: any[] = [];
  subTopics: any[] = [];
  homeWork: any[] = [];
  subjects: any[] = [];
  duplicateTopics: any[] = [];
  duplicateSubTopics: any[] = [];
  duplicateHomeWorkData: any[] = [];
  isShowMessage: boolean = false;
  user: User;
  homeworkQstnsList: any[] = [];
  displayWarningMsg: boolean = false;
  isMathSubject: boolean = true;

  constructor(private spinnerService: NgxSpinnerService,
    private fb: FormBuilder,
    private dataProvider: DataProvider,
    private router: Router,
    private authenticationService: AuthenticationService,
    private studentCommonEndpointsService: StudentCommonEndpointsService,
    private adminCommonEndpointsService: AdminCommonEndpointsService) {
    this.user = this.authenticationService.userValue;
    if (this.dataProvider.storage) {
      this.isShowMessage = this.dataProvider.storage['isShowMessage'];
      setTimeout(() => {
        this.isShowMessage = false;
      }, 2000);
    } else {
      this.isShowMessage = false;
    }
  }

  ngOnInit() {
    this.homeworkForm = this.fb.group({
      SubjectId: new FormControl(null, Validators.required),
      HomeWorkIds: new FormControl(null, Validators.required)
    });

    this.loadData();

  }

  // test code starts here
  loadData() {
    this.spinnerService.show();
    const subjectsDropdown = {
      dropdown: 'Subjects',
      sortby: 'SubjectName',
      selectfields: 'SubjectName as name,SubjectId as id'
    };
    this.adminCommonEndpointsService.getDropdowns(subjectsDropdown).subscribe(result => {
      this.subjects = result['message'];
    });

    this.adminCommonEndpointsService.getHomeWorksbybatchid(this.user.BatchIds).subscribe(res => {
      this.duplicateHomeWorkData = res;
    });

    this.spinnerService.hide();
  }

  onChangeSubject(event) {
    if (event.target.value !== null && event.target.value !== '') {
      this.homeWork = this.duplicateHomeWorkData.filter(x => x && x.SubjectId.toString() === event.target.value);
    }
  }

  allFormsValid() {
    return this.homeworkForm.valid;
  }

  generateTest() {
    var homeworkObj = {
      HomeWorkIds: this.homeworkForm.get('HomeWorkIds').value,
      SubjectId: this.homeworkForm.get('SubjectId').value,
    };

    if (homeworkObj.SubjectId && Number(homeworkObj.SubjectId) === SubjectsEnum.English) {
      this.studentCommonEndpointsService.getHomeworkQuestionsList(homeworkObj.SubjectId, '1', '1', homeworkObj.HomeWorkIds, '1').subscribe(res => {
        this.homeworkQstnsList = res;
        if (this.homeworkQstnsList.length > 0) {
          const homeworkTest: IAddExamId = {
            StudentId: this.user.UserId,
            TestId: studentTestEnum.HomeworkTest
          };
          this.studentCommonEndpointsService.addEnglishExamId(homeworkTest).subscribe(result => {

          });
          this.dataProvider.storage = {
            selectedHomeworkData: this.homeworkQstnsList
          };
          this.router.navigate(['/user/tuition/english-homework-test']);
        } else {
          this.displayWarningMsg = true;
        }
      }, (e) => {
        // this.messageService.showError('', 'Error in while adding...');
        // 
      });
    } else {

      this.studentCommonEndpointsService.getHomeworkQuestionsList(homeworkObj.SubjectId, '1', '1', homeworkObj.HomeWorkIds, '1').subscribe(res => {
        this.homeworkQstnsList = res;
        if (this.homeworkQstnsList.length > 0) {
          const homeworkTest: IAddExamId = {
            StudentId: this.user.UserId,
            TestId: studentTestEnum.HomeworkTest
          };
          this.studentCommonEndpointsService.addExamIds(homeworkTest).subscribe(result => {

          });
          this.dataProvider.storage = {
            selectedHomeworkData: this.homeworkQstnsList
          };
          this.router.navigate(['/user/tuition/homework-test']);
        } else {
          this.displayWarningMsg = true;
        }
      }, (e) => {
        // this.messageService.showError('', 'Error in while adding...');
        // 
      });
    }

  }

}
