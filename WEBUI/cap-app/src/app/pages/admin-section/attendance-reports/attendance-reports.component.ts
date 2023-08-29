import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { MessageService, LazyLoadEvent } from 'primeng/api';
import { rolesEnum } from 'src/app/models/Enum/roles';
import { User } from 'src/app/models/interfaces';
import { AdminCommonEndpointsService } from 'src/app/services/admin-common-endpoints.service';
import { AuthenticationService } from 'src/app/services/authentication.service';

@Component({
  selector: 'app-attendance-reports',
  templateUrl: './attendance-reports.component.html',
  styleUrls: ['./attendance-reports.component.scss']
})
export class AttendanceReportsComponent implements OnInit {

  batches: any[] = [];
  user: User;
  attendanceReportForm: FormGroup;
  attendanceReport: any[] = [];
  totalRecords: number;
  isEnableExportCSVBtn: boolean = false;
  lazyLoadEvent: any;

  constructor(private adminCommonEndpointsService: AdminCommonEndpointsService,
    private authenticationService: AuthenticationService,
    private spinnerService: NgxSpinnerService,
    private fb: FormBuilder,
    private messageService: MessageService) { }

  ngOnInit() {
    this.user = this.authenticationService.userValue;
    this.attendanceReportForm = this.fb.group({
      BatchId: new FormControl(null, Validators.required),
      FromDate: new FormControl(null, Validators.required),
      ToDate: new FormControl(null, Validators.required)
    });
    this.refreshData();
    this.loadSubjects(this.lazyLoadEvent);
  }

  refreshData() {
    this.spinnerService.show();
    // this.adminCommonEndpointsService.getbatchidsbytutorid(this.user.UserId).subscribe(result => {
    //   this.batches = result;
    // });
    this.adminCommonEndpointsService.getCommonLists('Batch', 'Order by', 'BatchId', 'ASC', true).subscribe(result => {
      if (this.user.Usertype === rolesEnum.SuperAdmin) {
        this.batches = result;
      } else if (this.user.Usertype === rolesEnum.CenterAdmin) {
        this.batches = result.filter(x => x.CenteradminId === this.user.UserId);
      } else {
        this.batches = result.filter(x => x.TutorId === this.user.UserId);
      }
      this.spinnerService.hide();
    }, error => {

      this.spinnerService.hide();
    });
  }

  isFormValid() {
    return this.attendanceReportForm.valid;
  }

  getAttendanceReport() {
    this.isEnableExportCSVBtn = true;
    this.spinnerService.show();
    const formValue = this.attendanceReportForm.value;
    this.adminCommonEndpointsService.getAttendanceReport(formValue.BatchId, JSON.parse(JSON.stringify(formValue.FromDate)), JSON.parse(JSON.stringify(formValue.ToDate))).subscribe(res => {
      if (this.user.Usertype === rolesEnum.SuperAdmin) {
        this.attendanceReport = res;
      } else if (this.user.Usertype === rolesEnum.CenterAdmin) {
        this.attendanceReport = res.filter(x => x.CenterAdminId === this.user.UserId);
      } else {
        this.attendanceReport = res.filter(x => x.TutorId === this.user.UserId);
      }
      this.totalRecords = this.attendanceReport.length;
      this.spinnerService.hide();
    }, error => {
      this.spinnerService.hide();
    });
  }

  loadSubjects(event: LazyLoadEvent) {
    this.spinnerService.show();
    this.lazyLoadEvent = event;
    setTimeout(() => {
      if (this.attendanceReport) {
        // if (event && event.first && event.rows) {
        //   this.attendanceReport = this.attendanceReport.slice(event.first, (event.first + event.rows));
        // } else {
        //   this.attendanceReport = this.attendanceReport.slice(0, 10);
        // }

        // this.attendanceReport = attendanceReport;
        // this.attendanceReport = this.attendanceReport.slice(event.first, (event.first + event.rows));
        this.spinnerService.hide();
      }
    }, 1000);
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
      a.download = 'attendanceReport.csv';
      a.click();
      window.URL.revokeObjectURL(url);
      a.remove();
    }
  }
}
