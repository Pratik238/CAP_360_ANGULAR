import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { LazyLoadEvent } from 'primeng/api';
import { studentTestEnum } from 'src/app/models/Enum/student-test';
import { User } from 'src/app/models/interfaces';
import { AdminCommonEndpointsService } from 'src/app/services/admin-common-endpoints.service';
import { AuthenticationService } from 'src/app/services/authentication.service';

@Component({
  selector: 'app-english-homework-report',
  templateUrl: './english-homework-report.component.html',
  styleUrls: ['./english-homework-report.component.scss']
})
export class EnglishHomeworkReportComponent implements OnInit {


  @ViewChild('displayHomeworkreports') displayHomeworkreports: ElementRef;
  @ViewChild('displayWarningMessage') displayWarningMessage: ElementRef;
  @ViewChild('displayExamInfo') displayExamInfo: ElementRef;

  homeworkData: any[] = [];
  selectedHomeworkRecord: any;
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
    this.loadHomeworkData(this.lazyLoadEvent)
  }

  loadHomeworkData(event: LazyLoadEvent) {
    this.spinnerService.show();
    this.lazyLoadEvent = event;
    this.adminCommonEndpointsService.getHomeworkEnglishReport(this.user.UserId, this.user.Usertype).subscribe(result => {
      this.dataSource = result;
      // if (event && event.first && event.rows) {
      //   this.homeworkData = this.dataSource.slice(event.first, (event.first + event.rows));
      // } else {
      //   this.homeworkData = this.dataSource.slice(0, 10);
      // }

      this.homeworkData = this.dataSource;
      // this.homeworkData = this.dataSource.slice(event.first, (event.first + event.rows));
      this.totalRecords = this.dataSource.length;
      this.spinnerService.hide();
    }, error => {
      this.spinnerService.hide();
    });
  }


  deleteReocrd(topic) {
    const index = this.homeworkData.findIndex(x => x._id === topic._id);
    if (index > -1) {
      this.homeworkData.splice(index, 1);
      this.modalService.dismissAll();
    }
  }

  viewSatReport(homeworkData) {
    this.selectedHomeworkRecord = homeworkData;
    this.modalService.open(this.displayHomeworkreports, {
      size: 'lg', windowClass: 'confirm-dialog-window',
      centered: true, backdrop: 'static', keyboard: false
    });
  }

  cancelModal() {
    this.modalService.dismissAll();
  }

  viewQuestionsByExamId(examId) {
    this.adminCommonEndpointsService.getAllEnglishQuestionbyexamid(examId.ExamId, studentTestEnum.HomeworkTest).toPromise().then(result => {
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

  removeHomework(homeworkData) {
    this.selectedHomeworkRecord = homeworkData;
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
      a.download = 'HomeworkReport.csv';
      a.click();
      window.URL.revokeObjectURL(url);
      a.remove();
    }
  }

}
