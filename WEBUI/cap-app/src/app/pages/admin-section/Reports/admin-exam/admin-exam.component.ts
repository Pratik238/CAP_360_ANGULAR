import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { LazyLoadEvent } from 'primeng/api';
import { studentTestEnum } from 'src/app/models/Enum/student-test';
import { User } from 'src/app/models/interfaces';
import { IAdminExam } from 'src/app/models/interfaces/admin-exam';
import { AdminCommonEndpointsService } from 'src/app/services/admin-common-endpoints.service';
import { AuthenticationService } from 'src/app/services/authentication.service';

@Component({
  selector: 'app-admin-exam',
  templateUrl: './admin-exam.component.html',
  styleUrls: ['./admin-exam.component.scss']
})
export class AdminExamComponent implements OnInit {

  @ViewChild('displayPracticeTestReport') displayPracticeTestReport: ElementRef;
  @ViewChild('displayWarningMessage') displayWarningMessage: ElementRef;
  @ViewChild('displayExamInfo') displayExamInfo: ElementRef;

  submitted = false;

  adminExamInfo: IAdminExam[] = [];
  practiceTestInfo: any;
  dataSource: any[] = [];
  totalRecords: number = 0;
  user: User;
  selectedExamInfo: any[] = [];
  totalExamResultRecords: number = 0;
  page = 0;

  lazyLoadEvent: any;

  constructor(private adminCommonEndpointsService: AdminCommonEndpointsService,
    private modalService: NgbModal,
    private authenticationService: AuthenticationService,
    private spinnerService: NgxSpinnerService) { }

  ngOnInit() {
    this.user = this.authenticationService.userValue;
    this.loadAdminExamQuestions(this.lazyLoadEvent);
  }

  loadAdminExamQuestions(event: LazyLoadEvent) {
    this.spinnerService.show();
    this.lazyLoadEvent = event;
    this.adminCommonEndpointsService.getAdminPracticeExamReport(this.user.UserId, this.user.Usertype).subscribe(result => {
      this.dataSource = result;
      // if (event && event.first && event.rows) {
      //   this.adminExamInfo = this.dataSource.slice(event.first, (event.first + event.rows));
      // } else {
      //   this.adminExamInfo = this.dataSource.slice(0, 10);
      // }

      this.adminExamInfo = this.dataSource;
      // this.adminExamInfo = this.dataSource.slice(event.first, (event.first + event.rows));
      this.totalRecords = this.dataSource.length;
      this.spinnerService.hide();
    }, error => {

      this.spinnerService.hide();
    });
  }


  deletePracticeTest(topic) {
    const index = this.adminExamInfo.findIndex(x => x._id === topic._id);
    if (index > -1) {
      this.adminExamInfo.splice(index, 1);
      this.modalService.dismissAll();
    }
  }

  viewPracticeTest(adminExamInfo) {
    this.practiceTestInfo = adminExamInfo;
    this.modalService.open(this.displayPracticeTestReport, {
      size: 'lg', windowClass: 'confirm-dialog-window',
      centered: true, backdrop: 'static', keyboard: false
    });
  }

  viewQuestionsByExamId(examId) {
    this.adminCommonEndpointsService.getAllQuestionByExamId(examId.ExamId, studentTestEnum.PracticeTest).toPromise().then(result => {
      this.totalExamResultRecords = result.length;
      this.selectedExamInfo = result;
      this.modalService.open(this.displayExamInfo, {
        size: 'lg', windowClass: 'confirm-dialog-window',
        centered: true, backdrop: 'static', keyboard: false
      });
    });
  }

  currentIndex(index) {
    this.page = index;
  }

  onCancelModal() {
    this.modalService.dismissAll();
  }

  removePracticeTest(practiceTestInfo) {
    this.practiceTestInfo = practiceTestInfo;
    this.modalService.open(this.displayWarningMessage, {
      size: 'md', windowClass: 'confirm-dialog-window',
      centered: true, backdrop: 'static', keyboard: false
    });
  }

  // Export csv code starts here
  downloadFile(data: any) {
    if (data !== null && data !== undefined) {
      const replacer = (key, value) => (value === null ? '' : value); // specify how you want to handle null values here
      const header = Object.keys(data[0]);
      const csv = data.map((row) =>
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
      a.download = 'PracticeTestReport.csv';
      a.click();
      window.URL.revokeObjectURL(url);
      a.remove();
    }
  }
}
