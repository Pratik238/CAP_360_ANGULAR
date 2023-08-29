import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { LazyLoadEvent, MessageService } from 'primeng/api';
import { rolesEnum } from 'src/app/models/Enum/roles';
import { User } from 'src/app/models/interfaces';
import { IAdminTableParams } from 'src/app/models/interfaces/admin-table';
import { AdminCommonEndpointsService } from 'src/app/services/admin-common-endpoints.service';
import { AuthenticationService } from 'src/app/services/authentication.service';

@Component({
  selector: 'app-batches',
  templateUrl: './batches.component.html',
  styleUrls: ['./batches.component.scss']
})
export class BatchesComponent implements OnInit {

  @ViewChild('addNewSubTopicForm') addNewSubTopicForm: ElementRef;
  @ViewChild('displayTopics') displayTopics: ElementRef;
  @ViewChild('displayWarningMessage') displayWarningMessage: ElementRef;

  batchForm: FormGroup;
  searchBatchForm: FormGroup;
  submitted = false;

  topics: any[] = [];

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


  batches: any[] = [];
  csvData: any[] = [];
  dataSource: any[] = [];
  lazyLoadEvent: any;
  batchData: any;
  user: User;
  isAddMode = true;
  allTutors: any[] = [];
  duplicateTutors: any[] = [];
  centerAdmin: any[] = [];
  centerAdminCopy: any[] = [];
  totalRecords: number;
  isActiveRecord: boolean = true;
  currentstatus: string = 'Active';
  isDislaySuperAdmin: boolean = false;

  constructor(private fb: FormBuilder,
    private adminCommonEndpointsService: AdminCommonEndpointsService,
    private authenticationService: AuthenticationService,
    private spinnerService: NgxSpinnerService,
    private modalService: NgbModal,
    private messageService: MessageService) { }

  ngOnInit() {
    this.batchForm = this.fb.group({
      BatchName: new FormControl('', Validators.required),
      TutorId: new FormControl('', Validators.required),
      // TutorId: new FormControl(''),
      CenteradminId: new FormControl(null),
    });

    // this.searchBatchForm = this.fb.group({
    //   BatchName: new FormControl('', Validators.required),
    //   TutorId: new FormControl(null, Validators.required),
    //   CenteradminId: new FormControl(null, Validators.required),
    //   FromDate: new FormControl('', Validators.required),
    //   ToDate: new FormControl('', Validators.required)
    // });

    this.refreshData();
    this.loadBatchesData(this.lazyLoadEvent);
  }

  refreshData() {
    this.user = this.authenticationService.userValue;
    var isSuperAdmin = 0;
    if (this.user.Usertype === rolesEnum.SuperAdmin) {
      this.isDislaySuperAdmin = true;
      if (this.batchForm.get('CenteradminId') !== undefined) {
        this.batchForm.get('CenteradminId').setValidators(Validators.required);
      }
      isSuperAdmin = 1;
    } else {
      isSuperAdmin = 0;
      this.isDislaySuperAdmin = false;
      if (this.batchForm.get('CenteradminId') !== undefined) {
        this.batchForm.get('CenteradminId').setValidators(null);
      }
    }
    this.spinnerService.show();
    this.adminCommonEndpointsService.getUsersList('3', this.user.UserId, isSuperAdmin).subscribe(result => {
      this.allTutors = result;
      this.duplicateTutors = result;
      this.spinnerService.hide();
    }, error => {
      this.spinnerService.hide();
    });
    this.adminCommonEndpointsService.getUsersList('4', this.user.UserId, isSuperAdmin).subscribe(result => {
      this.centerAdmin = result;
      this.centerAdminCopy = result;
      this.spinnerService.hide();
    }, error => {
      this.spinnerService.hide();
    });
  }

  onSearchData() {
    // console.log(this.searchBatchForm);
  }

  loadBatchesData(event: LazyLoadEvent) {
    this.spinnerService.show();
    this.lazyLoadEvent = event;
    this.adminCommonEndpointsService.getCommonLists('vw_Batches', 'Order by', 'BatchId', 'ASC', true).subscribe(result => {
      if (this.user.Usertype === rolesEnum.SuperAdmin) {
        this.dataSource = result;
      } else {
        this.dataSource = result.filter(x => x.CenteradminId === this.user.UserId);
      }
      this.csvData = JSON.parse(JSON.stringify(this.dataSource));
      // if (event && event.first && event.rows) {
      //   this.batches = this.dataSource.slice(event.first, (event.first + event.rows));
      // } else {
      //   this.batches = this.dataSource.slice(0, 10);
      // }

      this.batches = this.dataSource;
      // this.batches = this.dataSource.slice(event.first, (event.first + event.rows));
      this.totalRecords = this.dataSource.length;
      this.spinnerService.hide();
    }, error => {
      this.spinnerService.hide();
    });
  }

  allFormsValid() {
    return this.batchForm.valid;
  }

  addNewSubTopic() {
    this.modalService.open(this.addNewSubTopicForm, {
      size: 'lg', windowClass: 'confirm-dialog-window',
      centered: true, backdrop: 'static', keyboard: false
    });
    this.refreshData();
  }

  cancelBatch() {
    this.modalService.dismissAll();
    this.batchForm.reset();
  }

  topicFormValid() {
    return this.batchForm.valid;
  }

  saveBatch() {
    this.modalService.dismissAll();
    var superAdmin = 0;
    if (this.user.Usertype === rolesEnum.SuperAdmin) {
      superAdmin = this.batchForm.get('CenteradminId').value;
    } else {
      superAdmin = this.user.UserId;
    }
    if (this.isAddMode) {
      const topicsParam: IAdminTableParams = {
        Table: 'Batch',
        FilterFieldName: 'BatchName',
        FilterFieldValue: this.batchForm.get('BatchName').value,
        Data: [
          {
            FieldName: 'BatchName',
            FieldValue: this.batchForm.get('BatchName').value
          },
          {
            FieldName: 'TutorId',
            FieldValue: this.batchForm.get('TutorId').value
          },
          {
            FieldName: 'CenteradminId',
            FieldValue: superAdmin
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

      this.spinnerService.show();
      this.adminCommonEndpointsService.addNewList(topicsParam).toPromise().then((result) => {
        this.messageService.add({ severity: 'success', summary: result['message'], detail: '' });
        this.loadBatchesData(this.lazyLoadEvent);
        this.spinnerService.hide();
        this.batchForm.reset();
      }, (e) => {
        // this.messageService.add({ severity: 'error', summary: 'Error in while adding...', detail: '' });
        this.spinnerService.hide();
      });
    } else {
      const topicsParam: IAdminTableParams = {
        Table: 'Batch',
        Data: [
          {
            FieldName: 'BatchId',
            FieldValue: this.batchData.BatchId
          },
          {
            FieldName: 'BatchName',
            FieldValue: this.batchForm.get('BatchName').value
          },
          {
            FieldName: 'TutorId',
            FieldValue: this.batchForm.get('TutorId').value
          },
          {
            FieldName: 'CenteradminId',
            FieldValue: superAdmin
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
      this.spinnerService.show();
      this.adminCommonEndpointsService.updateRecord(topicsParam).toPromise().then((result) => {
        this.messageService.add({ severity: 'success', summary: result['message'], detail: '' });
        this.loadBatchesData(this.lazyLoadEvent);
        this.spinnerService.hide();
        this.batchForm.reset();
        this.modalService.dismissAll();
      }, (e) => {
        // this.messageService.add({ severity: 'error', summary: 'Error in while updating...', detail: '' });
        this.spinnerService.hide();
      });
    }
  }

  editBatch(batchData) {
    this.batchData = batchData;
    if (this.centerAdminCopy.length > 0) {
      this.centerAdmin = this.centerAdminCopy.filter(x => x.UserId === batchData.CenteradminId);
      this.allTutors = this.duplicateTutors.filter(x => x.UserId === batchData.TutorId);
    }
    this.batchForm.patchValue({
      BatchName: batchData.BatchName,
      TutorId: batchData.TutorId,
      CenteradminId: batchData.CenteradminId,
      IsActive: batchData.IsActive ? 1 : 0,
    });
    // filtering only added center admin
    // if (this.centerAdminCopy.length > 0) {
    //   this.centerAdmin = this.centerAdminCopy.filter(x => x.UserId === batchData.CenteradminId);
    //   this.allTutors = this.duplicateTutors.filter(x => x.UserId === batchData.TutorId);
    // }
    this.isAddMode = false;
    this.modalService.open(this.addNewSubTopicForm, {
      size: 'lg', windowClass: 'confirm-dialog-window',
      centered: true, backdrop: 'static', keyboard: false
    });
  }

  onChangeCenterAdmin(event) {
    if (event.target.value !== null && event.target.value !== undefined) {
      this.allTutors = this.duplicateTutors.filter(x => Number(x.CenterAdminId) === Number(event.target.value));
    }
  }

  closeModal() {
    this.batchForm.reset();
  }

  deleteBatch(batchData) {
    this.spinnerService.show();
    const removeRecord = {
      Table: 'Batch',
      PKey: batchData.BatchId
    };
    this.adminCommonEndpointsService.deleteRecord(removeRecord).subscribe(result => {
      this.spinnerService.hide();
      this.messageService.add({ severity: 'success', summary: 'Batch removed successfully', detail: '' });
      this.modalService.dismissAll();
      this.loadBatchesData(this.lazyLoadEvent);
    }, (e) => {
      // this.messageService.add({ severity: 'error', summary: 'Error in while removing...', detail: '' });
      this.spinnerService.hide();
      this.modalService.dismissAll();
    });
  }

  viewTopic(batchData) {
    this.spinnerService.show();
    this.batchData = batchData;
    this.modalService.open(this.displayTopics, {
      size: 'lg', windowClass: 'confirm-dialog-window',
      centered: true, backdrop: 'static', keyboard: false
    });
    this.spinnerService.hide();
  }

  removeTopic(batchData) {
    this.batchData = batchData;
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
      a.download = 'BatchesReport.csv';
      a.click();
      window.URL.revokeObjectURL(url);
      a.remove();
    }
  }

}
