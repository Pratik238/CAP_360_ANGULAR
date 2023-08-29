import { AdminCommonEndpointsService } from 'src/app/services/admin-common-endpoints.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { DataProvider } from 'src/app/helpers/providers/data.provider';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { User } from 'src/app/models/interfaces';
import { SharedService } from 'src/app/helpers/providers/shared.service';
import { IAdminTableParams } from 'src/app/models/interfaces/admin-table';
import { studentTestEnum } from 'src/app/models/Enum/student-test';
import { IAddExamId } from 'src/app/models/interfaces/add-exam';
import { StudentCommonEndpointsService } from 'src/app/services/student-common-endpoints.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-maths',
  templateUrl: './maths.component.html',
  styleUrls: ['./maths.component.scss']
})
export class MathsComponent implements OnInit {

  testTime: any[] = [];
  englishForm: FormGroup;
  topics: any[] = [];
  subTopics: any[] = [];
  duplicateTopics: any[] = [];
  duplicateSubTopics: any[] = [];

  isShowData: boolean = true;
  user: User;

  constructor(private router: Router,
    private fb: FormBuilder,
    private dataProvider: DataProvider,
    private authenticationService: AuthenticationService,
    private adminCommonEndpointsService: AdminCommonEndpointsService,
    private sharedService: SharedService,
    private studentCommonEndpointsService: StudentCommonEndpointsService,
    private messageService: MessageService,
    private spinnerService: NgxSpinnerService) {
    this.user = this.authenticationService.userValue;
  }

  ngOnInit() {

    this.loadData();
    this.englishForm = this.fb.group({
      SubTopicId: new FormControl(null, Validators.required),
      TopicId: new FormControl(null, Validators.required),
    });

    this.adminCommonEndpointsService.getTestTime().subscribe(result => {
      this.testTime = result;
    });
    this.spinnerService.hide();
  }
  onClickGoToStartExam() {
    this.sharedService.setStorage({ formValue: this.englishForm });
    this.dataProvider.storage = {
      mathsData: this.englishForm.get('SubTopicId').value
    };
    this.router.navigate(['/start-exam']);
  }

  // test code starts here
  loadData() {
    this.spinnerService.show();
    this.adminCommonEndpointsService.getSubtopicsbybatchid(this.user.UserId, this.user.BatchIds).subscribe(res => {
      this.duplicateSubTopics = res;
    });
    this.adminCommonEndpointsService.getTopicsbybatchid(this.user.UserId, this.user.BatchIds, '1').subscribe(res => {
      this.topics = res;
    });

    this.spinnerService.hide();
  }

  onChangeTopic(event) {
    if (event.target.value !== null) {
      const filteredSubTopics = this.duplicateSubTopics.filter(x => x.TopicId.toString() === event.target.value.toString());
      this.subTopics = filteredSubTopics;
    } else {
      this.subTopics = [];
    }
  }

  allFormsValid() {
    return this.englishForm.valid;
  }

  generateTest() {
    const practiceTest: IAddExamId = {
      StudentId: this.user.UserId,
      TestId: studentTestEnum.PracticeTest
    };
    let topicId = this.englishForm.value.TopicId;
    const subTopicId = this.englishForm.value.SubTopicId;
    this.adminCommonEndpointsService
      .getQuestionsList(this.user.UserId, '1', topicId, '2', subTopicId, '0')
      .subscribe(result => {
        if (result && result.length === 20) {
          this.studentCommonEndpointsService.addExamIds(practiceTest).subscribe(result => {
          });
          this.sharedService.setStorage({ formValue: this.englishForm, isFromMathsPracticeTest: true, isFromJumbleMathsTest: false });
          this.router.navigate(['/start-exam']);
        } else {
          this.messageService.add({ severity: 'error', summary: 'Unable to generate test...', detail: '' });
        }
      });
  }

}
