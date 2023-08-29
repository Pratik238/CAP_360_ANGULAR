import { ElementRef, ViewChild } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { LazyLoadEvent } from 'primeng/api';
import { studentTestEnum } from 'src/app/models/Enum/student-test';
import { User } from 'src/app/models/interfaces';
import { AdminCommonEndpointsService } from 'src/app/services/admin-common-endpoints.service';
import { AuthenticationService } from 'src/app/services/authentication.service';

@Component({
  selector: 'app-english-jumble-test-report',
  templateUrl: './english-jumble-test-report.component.html',
  styleUrls: ['./english-jumble-test-report.component.scss']
})
export class EnglishJumbleTestReportComponent implements OnInit {

  @ViewChild('displayTopics') displayTopics: ElementRef;
  @ViewChild('displayWarningMessage') displayWarningMessage: ElementRef;
  @ViewChild('displayExamInfo') displayExamInfo: ElementRef;

  selectedProducts: [];

  value: Date;
  submitted = false;

  adminExamInfo: any[] = [];
  selectedExamInfo: any;
  viewQuestions: any[] = [];
  dataSource: any[] = [];
  totalExamResultRecords: number = 0;
  totalRecords: number = 0;
  page = 0;
  user: User;
  lazyLoadEvent: any;

  constructor(private adminCommonEndpointsService: AdminCommonEndpointsService,
    private modalService: NgbModal,
    private authenticationService: AuthenticationService,
    private spinnerService: NgxSpinnerService) { }

  ngOnInit() {
    this.user = this.authenticationService.userValue;
    this.loadAdminExamQuestions(this.lazyLoadEvent)

  }

  loadAdminExamQuestions(event: LazyLoadEvent) {
    this.spinnerService.show();
    this.lazyLoadEvent = event;
    this.adminCommonEndpointsService.getAdminPracticeExamSATEnglishReport(this.user.UserId, this.user.Usertype, studentTestEnum.JumbleTest).subscribe(result => {
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


  deletePracticeTestReport(topic) {
    const index = this.adminExamInfo.findIndex(x => x._id === topic._id);
    if (index > -1) {
      this.adminExamInfo.splice(index, 1);
      this.modalService.dismissAll();
    }
  }

  viewSatReport(adminExamInfo) {
    this.selectedExamInfo = adminExamInfo;
    this.modalService.open(this.displayTopics, {
      size: 'lg', windowClass: 'confirm-dialog-window',
      centered: true, backdrop: 'static', keyboard: false
    });
  }

  cancelModal() {
    this.modalService.dismissAll();
  }

  viewQuestionsByExamId(examId) {
    this.spinnerService.show();
    this.adminCommonEndpointsService.getAllEnglishQuestionbyexamid(examId.ExamId, studentTestEnum.JumbleTest).toPromise().then(result => {
      this.viewQuestions = result;
      this.totalExamResultRecords = result.length;
      this.modalService.open(this.displayExamInfo, {
        size: 'lg', windowClass: 'confirm-dialog-window',
        centered: true, backdrop: 'static', keyboard: false
      });
    });
    this.spinnerService.hide();
  }

  currentIndex(index) {
    this.page = index;
  }

  removeSatReport(adminExamInfo) {
    this.selectedExamInfo = adminExamInfo;
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
      a.download = 'satReport.csv';
      a.click();
      window.URL.revokeObjectURL(url);
      a.remove();
    }
  }

}
