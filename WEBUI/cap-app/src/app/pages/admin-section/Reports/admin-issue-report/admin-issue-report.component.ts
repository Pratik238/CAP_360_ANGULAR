import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators, FormBuilder } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { LazyLoadEvent, MessageService } from 'primeng/api';
import { rolesEnum } from 'src/app/models/Enum/roles';
import { User } from 'src/app/models/interfaces';
import { IAdminIssueReport } from 'src/app/models/interfaces/admin-exam';
import { IAdminTableParams } from 'src/app/models/interfaces/admin-table';
import { AdminCommonEndpointsService } from 'src/app/services/admin-common-endpoints.service';
import { AuthenticationService } from 'src/app/services/authentication.service';

@Component({
  selector: 'app-admin-issue-report',
  templateUrl: './admin-issue-report.component.html',
  styleUrls: ['./admin-issue-report.component.scss']
})
export class AdminIssueReportComponent implements OnInit {


  @ViewChild('displayIssueReports') displayIssueReports: ElementRef;
  @ViewChild('displayWarningMessage') displayWarningMessage: ElementRef;

  reportQuestionForm: FormGroup;

  allIssueReports: IAdminIssueReport[] = [];
  dataSource: any[] = [];
  selectedIssueReport: any;
  totalRecords: number;
  isActiveRecord: boolean = true;
  currentstatus: string = 'Active';
  lazyLoadEvent: any;
  user: User;

  constructor(private adminCommonEndpointsService: AdminCommonEndpointsService,
    private fb: FormBuilder,
    private spinnerService: NgxSpinnerService,
    private authenticationService: AuthenticationService,
    private modalService: NgbModal,
    private messageService: MessageService) { }

  ngOnInit() {
    this.user = this.authenticationService.userValue;
    this.reportQuestionForm = this.fb.group({
      Comments: new FormControl('', Validators.required),
    });
    this.loadIssueReports(this.lazyLoadEvent);
  }

  loadIssueReports(event: LazyLoadEvent) {
    this.spinnerService.show();
    this.lazyLoadEvent = event;
    this.adminCommonEndpointsService.getCommonLists('vw_IssueReport', 'Order by', 'Issueid', 'DESC', this.isActiveRecord).subscribe(result => {
      this.spinnerService.hide();
      if (this.user.Usertype === rolesEnum.SuperAdmin) {
        this.dataSource = result;
      } else if (this.user.Usertype === rolesEnum.CenterAdmin) {
        this.dataSource = result.filter(x => x.CenterAdminId === this.user.UserId);
      } else {
        this.dataSource = result.filter(x => x.TutorId === this.user.UserId);
      }
      // if (event && event.first && event.rows) {
      //   this.allIssueReports = this.dataSource.slice(event.first, (event.first + event.rows));
      // } else {
      //   this.allIssueReports = this.dataSource.slice(0, 10);
      // }

      this.allIssueReports = this.dataSource;
      // this.allIssueReports = this.dataSource.slice(event.first, (event.first + event.rows));
      this.totalRecords = this.allIssueReports.length;
    }, error => {
      this.spinnerService.hide();
    });
  }

  getLoadStatusRecords(status: boolean) {
    this.isActiveRecord = status;
    this.loadIssueReports(this.lazyLoadEvent);
  }

  viewIssueReport(issueReport) {
    this.spinnerService.show();
    const viewRecord = {
      Table: 'vw_IssueReport',
      PKey: 'Issueid',
      PKeyFld: issueReport.Issueid
    };
    this.adminCommonEndpointsService.getRecordById(viewRecord).subscribe(result => {
      this.selectedIssueReport = result['message'][0];
      this.modalService.open(this.displayIssueReports, {
        size: 'lg', windowClass: 'confirm-dialog-window',
        centered: true, backdrop: 'static', keyboard: false
      });
      this.spinnerService.hide();
    }, (e) => {
      this.spinnerService.hide();
      // this.messageService.add({ severity: 'error', summary: 'Error in while opening...', detail: '' });
      this.modalService.dismissAll();
    });
  }

  cancelModal() {
    this.modalService.dismissAll();
  }

  removeIssueReport(issueReport) {
    this.selectedIssueReport = issueReport;
    this.modalService.open(this.displayWarningMessage, {
      size: 'md', windowClass: 'confirm-dialog-window',
      centered: true, backdrop: 'static', keyboard: false
    });
  }

  reportIssue() {
    const reportIssueQuestion: IAdminTableParams = {
      Table: 'IssueReport',
      Data: [
        {
          FieldName: 'Issueid',
          FieldValue: this.selectedIssueReport.Issueid
        },
        {
          FieldName: 'Comments',
          FieldValue: this.reportQuestionForm.get('Comments').value
        },
        {
          FieldName: 'IsActive',
          FieldValue: 0
        }
      ]
    };
    this.adminCommonEndpointsService.updateRecord(reportIssueQuestion).toPromise().then((result) => {
      this.messageService.add({ severity: 'success', summary: 'Issue Resolved successfully', detail: '' });
      this.loadIssueReports(this.lazyLoadEvent);
      this.modalService.dismissAll();
      this.reportQuestionForm.reset();
      this.spinnerService.hide();
    }, (e) => {
      // this.messageService.add({ severity: 'error', summary: 'Error while reporting', detail: '' });
      this.reportQuestionForm.reset();
      this.modalService.dismissAll();
    });
  }

  reportFormValid() {
    return this.reportQuestionForm.valid;
  }

  cancelReportQuestionDiaouge() {
    this.reportQuestionForm.reset();
    this.modalService.dismissAll();
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
      a.download = 'IssueReport.csv';
      a.click();
      window.URL.revokeObjectURL(url);
      a.remove();
    }
  }
}
