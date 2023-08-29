import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { MessageService } from 'primeng/api';
import { SharedService } from 'src/app/helpers/providers/shared.service';
import { studentTestEnum } from 'src/app/models/Enum/student-test';
import { User } from 'src/app/models/interfaces';
import { IAddExamId } from 'src/app/models/interfaces/add-exam';
import { AdminCommonEndpointsService } from 'src/app/services/admin-common-endpoints.service';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { StudentCommonEndpointsService } from 'src/app/services/student-common-endpoints.service';
import { ToasterService } from 'src/app/services/toaster.service';

@Component({
  selector: 'app-english',
  templateUrl: './english.component.html',
  styleUrls: ['./english.component.scss']
})
export class EnglishComponent implements OnInit {

  englishForm: FormGroup;
  topics: any[] = [];
  subTopics: any[] = [];
  duplicateTopics: any[] = [];
  duplicateSubTopics: any[] = [];
  user: User;

  constructor(private adminCommonEndpointsService: AdminCommonEndpointsService,
    private spinnerService: NgxSpinnerService,
    private fb: FormBuilder,
    private router: Router,
    private sharedService: SharedService,
    private studentCommonEndpointsService: StudentCommonEndpointsService,
    private authenticationService: AuthenticationService,
    private messageService: MessageService,
    private modalService: NgbModal,
    private toasterService: ToasterService) {
  }

  ngOnInit() {
    this.user = this.authenticationService.userValue;
    this.loadData();
    this.englishForm = this.fb.group({
      SubTopicId: new FormControl(null, Validators.required),
      TopicId: new FormControl(null, Validators.required),
    });
  }

  loadData() {
    this.spinnerService.show();

    this.studentCommonEndpointsService.getTopicsbybatchid(this.user.UserId, this.user.BatchIds, '2').subscribe(res => {
      this.topics = res;
    });

    this.studentCommonEndpointsService.getSubtopicsbybatchid(this.user.UserId, this.user.BatchIds).subscribe(res => {
      this.duplicateSubTopics = res;
    });

    this.spinnerService.hide();
  }

  onChangeSubTopic(event) { }

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
      .getEnglishQuestionsList(this.user.UserId, '2', topicId, '1', subTopicId, '0')
      .subscribe(result => {
        // if (result && result.length === 20) {
        this.studentCommonEndpointsService.addEnglishExamId(practiceTest).subscribe(result => {
        });
        this.sharedService.setStorage({ formValue: this.englishForm, isFromEnglishPracticeTest: true, isFromJumbleMathsTest: false });
        this.router.navigate(['/english-exam']);
        // } else {
        //   this.messageService.add({ severity: 'error', summary: 'Unable to generate test...', detail: '' });
        // }
      });
  }

}
