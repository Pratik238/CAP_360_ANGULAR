import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { LazyLoadEvent, MessageService } from 'primeng/api';
import { rolesEnum } from 'src/app/models/Enum/roles';
import { User } from 'src/app/models/interfaces';
import { IAdminTableParams, IAssignJumbleTest } from 'src/app/models/interfaces/admin-table';
import { AdminCommonEndpointsService } from 'src/app/services/admin-common-endpoints.service';
import { AuthenticationService } from 'src/app/services/authentication.service';

@Component({
  selector: 'app-jumble-test-assign',
  templateUrl: './jumble-test-assign.component.html',
  styleUrls: ['./jumble-test-assign.component.scss']
})
export class JumbleTestAssignComponent implements OnInit {

  @ViewChild('assignHomeworkForm') assignHomeworkForm: ElementRef;
  @ViewChild('displayTopics') displayTopics: ElementRef;
  @ViewChild('displayWarningMessage') displayWarningMessage: ElementRef;

  batchForm: FormGroup;
  submitted = false;
  currentstatus = 'true';
  statuses: any[] = [
    {
      id: 1,
      value: 'Active'
    },
    {
      id: 0,
      value: 'In-active'
    }
  ];

  allSatExamData: any[] = [];
  dataSource: any[] = [];
  lazyLoadEvent: any;
  topic: any;
  user: User;
  isAddMode = true;
  subjects: any[] = [];

  batches: any[] = [];
  totalRecords: number = 0;

  constructor(private fb: FormBuilder,
    private adminCommonEndpointsService: AdminCommonEndpointsService,
    private authenticationService: AuthenticationService,
    private spinnerService: NgxSpinnerService,
    private modalService: NgbModal,
    private messageService: MessageService) { }

  ngOnInit() {

    this.refreshData();
    this.batchForm = this.fb.group({
      BatchId: new FormControl(null, Validators.required),
      SubjectId: new FormControl(null, Validators.required),
      Status: new FormControl(null, Validators.required),
    });
    this.loadJumbleTestData(this.lazyLoadEvent);
  }

  refreshData() {
    this.spinnerService.show();
    this.user = this.authenticationService.userValue;
    const subjectDropdownObj = {
      dropdown: 'Subjects',
      sortby: 'SubjectName',
      selectfields: 'SubjectName as name,SubjectId as id'
    };
    this.adminCommonEndpointsService.getDropdowns(subjectDropdownObj).subscribe(result => {
      this.subjects = result['message'];
      this.spinnerService.hide();
    }, error => { this.spinnerService.hide(); });
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

  onSearchData() { }

  loadJumbleTestData(event: LazyLoadEvent, status = 'true') {
    this.spinnerService.show();
    this.lazyLoadEvent = event;
    this.currentstatus = status;
    this.adminCommonEndpointsService.getCommonLists('vw_TestCompletionStatus', 'Order by', 'Id', 'ASC', this.currentstatus).subscribe(result => {
      if (this.user.Usertype === rolesEnum.SuperAdmin) {
        this.dataSource = result;
      } else if (this.user.Usertype === rolesEnum.CenterAdmin) {
        this.dataSource = result.filter(x => x.CenterAdminId === this.user.UserId);
      } else {
        this.dataSource = result.filter(x => x.TutorId === this.user.UserId);
      }
      // if (event && event.first && event.rows) {
      //   this.allSatExamData = this.dataSource.slice(event.first, (event.first + event.rows));
      // } else {
      //   this.allSatExamData = this.dataSource.slice(0, 10);
      // }
      this.spinnerService.hide();
      this.allSatExamData = this.dataSource;
      // this.allSatExamData = this.dataSource.slice(event.first, (event.first + event.rows));
      this.totalRecords = this.dataSource.length;
    }, error => {
      this.spinnerService.hide();
    });
  }

  allFormsValid() {
    return this.batchForm.valid;
  }

  assignHomework() {
    this.isAddMode = true;
    this.modalService.open(this.assignHomeworkForm, {
      size: 'lg', windowClass: 'confirm-dialog-window',
      centered: true, backdrop: 'static', keyboard: false
    });
    this.batchForm.patchValue({
      Status: 1
    });
  }

  cancelModal() {
    this.modalService.dismissAll();
    this.batchForm.reset();
  }

  topicFormValid() {
    return this.batchForm.valid;
  }

  saveBatch() {
    this.spinnerService.show();
    if (this.isAddMode) {
      const jumbleTestObj: IAdminTableParams = {
        Table: 'TestCompletionStatus',
        FilterFieldName: 'IsDeleted',
        FilterFieldValue: '1',
        Data: [
          {
            FieldName: 'BatchId',
            FieldValue: this.batchForm.get('BatchId').value
          },
          {
            FieldName: 'SubjectId',
            FieldValue: this.batchForm.get('SubjectId').value
          },
          {
            FieldName: 'Status',
            FieldValue: this.batchForm.get('Status').value
          },
          {
            FieldName: 'Createdby',
            FieldValue: this.user.Name
          },
          {
            FieldName: 'UpdatedBy',
            FieldValue: this.user.Name
          }
        ]
      };

      this.adminCommonEndpointsService.addNewList(jumbleTestObj).toPromise().then((result) => {
        this.messageService.add({ severity: 'success', summary: 'Jumble Test Assigned successfully', detail: '' });
        this.refreshData();
        this.loadJumbleTestData(this.lazyLoadEvent);
        this.batchForm.reset();
        this.spinnerService.hide();
        this.modalService.dismissAll();
      }, (e) => {
        this.spinnerService.hide();
        // this.messageService.add({ severity: 'error', summary: 'Error in while assiging...', detail: '' });

        this.modalService.dismissAll();
      });
    } else {
      const jumbleTestObj: IAdminTableParams = {
        Table: 'TestCompletionStatus',
        FilterFieldName: 'BatchId',
        FilterFieldValue: this.batchForm.get('BatchId').value,
        Data: [
          {
            FieldName: 'Id',
            FieldValue: this.topic.Id
          },
          {
            FieldName: 'BatchId',
            FieldValue: this.batchForm.get('BatchId').value
          },
          {
            FieldName: 'SubjectId',
            FieldValue: this.batchForm.get('SubjectId').value
          },
          {
            FieldName: 'Status',
            FieldValue: this.batchForm.get('Status').value
          },
          {
            FieldName: 'Createdby',
            FieldValue: this.user.Name
          },
          {
            FieldName: 'UpdatedBy',
            FieldValue: this.user.Name
          }
        ]
      };
      this.adminCommonEndpointsService.updateRecord(jumbleTestObj).toPromise().then((result) => {
        this.messageService.add({ severity: 'success', summary: result['message'], detail: '' });
        this.refreshData();
        this.loadJumbleTestData(this.lazyLoadEvent);
        this.batchForm.reset();
        this.spinnerService.hide();
        this.modalService.dismissAll();
      }, (e) => {
        this.spinnerService.hide();
        // this.messageService.add({ severity: 'error', summary: 'Error in while updating...', detail: '' });
        this.modalService.dismissAll();
      });
    }
  }

  editTopic(topic) {
    this.topic = topic;
    this.batchForm.patchValue({
      BatchId: topic.BatchId,
      StudentId: topic.StudentId,
    });
    this.isAddMode = false;
    this.modalService.open(this.assignHomeworkForm, {
      size: 'lg', windowClass: 'confirm-dialog-window',
      centered: true, backdrop: 'static', keyboard: false
    });
  }

  deleteSatExam(subTopic) {
    this.spinnerService.show();
    const findIndex = this.allSatExamData.findIndex(x => x.BatchName === subTopic.BatchName);
    this.allSatExamData.splice(findIndex, 1);
    this.messageService.add({ severity: 'success', summary: 'Successfully removed...', detail: '' });
    this.spinnerService.hide();
    this.modalService.dismissAll();
  }

  viewTopic(topic) {
    this.spinnerService.show();
    this.topic = topic;
    this.modalService.open(this.displayTopics, {
      size: 'lg', windowClass: 'confirm-dialog-window',
      centered: true, backdrop: 'static', keyboard: false
    });
    this.spinnerService.hide();
  }

  removeTopic(topic) {
    this.topic = topic;
    this.modalService.open(this.displayWarningMessage, {
      size: 'md', windowClass: 'confirm-dialog-window',
      centered: false, backdrop: 'static', keyboard: false
    });
  }
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
      a.download = 'JumbleTestReport.csv';
      a.click();
      window.URL.revokeObjectURL(url);
      a.remove();
    }
  }

}
