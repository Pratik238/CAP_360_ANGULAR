import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators, FormArray } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { LazyLoadEvent, MessageService } from 'primeng/api';
import { rolesEnum } from 'src/app/models/Enum/roles';
import { User } from 'src/app/models/interfaces';
import { IAdminTableParams, IAssignBatch } from 'src/app/models/interfaces/admin-table';
import { AdminCommonEndpointsService } from 'src/app/services/admin-common-endpoints.service';
import { AuthenticationService } from 'src/app/services/authentication.service';

@Component({
  selector: 'app-batch-assign',
  templateUrl: './batch-assign.component.html',
  styleUrls: ['./batch-assign.component.scss']
})
export class BatchAssignComponent implements OnInit {

  @ViewChild('addAssignBatchForm') addAssignBatchForm: ElementRef;
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

  selected = [];

  allBatchAssign: any[] = [];
  dataSource: any[] = [];
  lazyLoadEvent: any;
  totalRecords: number;
  topic: any;
  user: User;
  isAddMode = true;
  allTutors: any[] = [];
  allStudents: any[] = [];

  batches: any[] = [];
  centerAdmin: any[] = [];
  isDislaySuperAdmin: boolean = false;
  displayStudentsNAMsg: boolean = false;
  selectedColumns: any[];
  cols: any[] = [];

  constructor(private fb: FormBuilder,
    private adminCommonEndpointsService: AdminCommonEndpointsService,
    private authenticationService: AuthenticationService,
    private spinnerService: NgxSpinnerService,
    private modalService: NgbModal,
    private messageService: MessageService) { }

  ngOnInit() {
    this.cols = [
      { field: 'AssignId', header: 'ID' },
      { field: 'BatchName', header: 'Batch' },
      { field: 'Studentname', header: 'Student' },
      { field: 'CenteradminName', header: 'Center Admin' },
    ];
    this.selectedColumns = this.cols;
    // this.searchBatchForm = this.fb.group({
    //   BatchName: new FormControl('', Validators.required),
    //   TutorId: new FormControl(null, Validators.required),
    //   CenteradminId: new FormControl(null, Validators.required),
    // });

    this.batchForm = this.fb.group({
      BatchId: new FormControl(null, Validators.required),
      CenteradminId: new FormControl(null),
      StudentId: new FormArray([])
    });
    this.refreshData();
    this.loadBathces(this.lazyLoadEvent);
  }

  refreshData() {
    this.spinnerService.show();
    this.user = this.authenticationService.userValue;
    this.adminCommonEndpointsService.getCommonLists('vw_Batches', 'Order by', 'BatchId', 'ASC', true).subscribe(result => {
      if (this.user.Usertype === rolesEnum.SuperAdmin) {
        this.batches = result;
      } else {
        this.batches = result.filter(x => x.CenteradminId === this.user.UserId);
      }
      this.spinnerService.hide();
    }, error => {
      this.spinnerService.hide();
    });

    if (this.user.Usertype === rolesEnum.SuperAdmin) {
      this.spinnerService.show();
      this.adminCommonEndpointsService.getUsersList('4', this.user.UserId, 0).subscribe(result => {
        this.centerAdmin = result;
        this.spinnerService.hide();
      }, error => {
        this.spinnerService.hide();
      });
      this.batchForm.get('CenteradminId').setValidators(Validators.required);
      this.isDislaySuperAdmin = true;
    } else {
      this.isDislaySuperAdmin = false;
      this.spinnerService.show();
      this.adminCommonEndpointsService.getStudentListBasedonCenter(this.user.UserId).subscribe(result => {
        this.spinnerService.hide();
        this.allStudents = result;
        this.addCheckboxes();
      }, error => {
        this.spinnerService.hide();
      });
    }
  }

  onSearchData() {
    // console.log(this.searchBatchForm);
  }

  onChnageCenteradmin(event) {
    if (event.target.value !== null && event.target.value !== '' && event.target.value !== 'null') {
      this.spinnerService.show();
      this.adminCommonEndpointsService.getStudentListBasedonCenter(event.target.value).subscribe(result => {
        this.allStudents = result;
        this.addCheckboxes();
        this.spinnerService.hide();
      }, e => {
        this.allStudents = [];
        this.clearStudents();
        this.spinnerService.hide();
      });
    }
  }

  loadBathces(event: LazyLoadEvent) {
    this.spinnerService.show();
    this.lazyLoadEvent = event;
    this.adminCommonEndpointsService.getCommonLists('vw_batchAssign', 'Order by', 'AssignId', 'ASC', true).subscribe(result => {
      this.spinnerService.hide();
      if (this.user.Usertype === rolesEnum.SuperAdmin) {
        this.dataSource = result;
      } else {
        this.dataSource = result.filter(x => x.centeradminId === this.user.UserId);
      }
      // if (event && event.first && event.rows) {
      //   this.allBatchAssign = this.dataSource.slice(event.first, (event.first + event.rows));
      // } else {
      //   this.allBatchAssign = this.dataSource.slice(0, 10);
      // }
      this.allBatchAssign = this.dataSource;
      // this.allBatchAssign = this.dataSource.slice(event.first, (event.first + event.rows));
      this.totalRecords = this.dataSource.length;
    }, error => {
      this.spinnerService.hide();
    });
  }

  get ordersFormArray() {
    return this.batchForm.controls.StudentId as FormArray;
  }

  private addCheckboxes() {
    this.allStudents.forEach(() => this.ordersFormArray.push(new FormControl(false)));
  }

  clearStudents() {
    if (this.allStudents.length > 0) {
      this.allStudents.forEach((x, i) => this.ordersFormArray.removeAt(0));
    }
  }

  allFormsValid() {
    return this.batchForm.valid;
  }

  assignBatch() {
    this.modalService.open(this.addAssignBatchForm, {
      size: 'lg', windowClass: 'confirm-dialog-window',
      centered: true, backdrop: 'static', keyboard: false
    });
  }

  cancelBatch() {
    this.batchForm.reset();
    this.modalService.dismissAll();
  }

  topicFormValid() {
    return this.batchForm.valid;
  }

  saveBatch() {
    const selectedStudentIds = this.batchForm.value.StudentId
      .map((checked, i) => checked ? this.allStudents[i].StudentId : null)
      .filter(v => v !== null);
    if (selectedStudentIds.length > 0) {
      this.displayStudentsNAMsg = false;
      const assignBatch: IAssignBatch = {
        BatchId: this.batchForm.get('BatchId').value,
        StudentIds: selectedStudentIds,
        Createdby: this.user.Name,
        Updatedby: this.user.Name
      };

      this.spinnerService.show();
      this.adminCommonEndpointsService.assignBatch(assignBatch).toPromise().then((result) => {
        this.messageService.add({ severity: 'success', summary: 'Batch Assigned successfully', detail: '' });
        this.loadBathces(this.lazyLoadEvent);
        this.refreshData();
        this.batchForm.reset();
        this.spinnerService.hide();
        this.modalService.dismissAll();
      }, (e) => {
        this.spinnerService.hide();
        // this.messageService.add({ severity: 'error', summary: 'Error in while assigning...', detail: '' });
        this.modalService.dismissAll();
      });
    } else {
      this.displayStudentsNAMsg = true;
    }
  }

  deleteBatch(batchAssign) {
    this.spinnerService.show();
    const removeRecord = {
      Table: 'BatchAssign',
      PKey: batchAssign.AssignId
    };
    this.adminCommonEndpointsService.deleteRecord(removeRecord).subscribe(result => {
      this.messageService.add({ severity: 'success', summary: result['message'], detail: '' });
      this.spinnerService.hide();
      this.modalService.dismissAll();
      this.loadBathces(this.lazyLoadEvent);
      this.refreshData();
    }, (e) => {
      // this.messageService.add({ severity: 'error', summary: 'Error in while deleting...', detail: '' });
      this.spinnerService.hide();
      this.modalService.dismissAll();
    });
  }

  viewBatchAssign(batchAssign) {
    // this.spinnerService.show();
    this.topic = batchAssign;
    this.modalService.open(this.displayTopics, {
      size: 'lg', windowClass: 'confirm-dialog-window',
      centered: true, backdrop: 'static', keyboard: false
    });
    // this.spinnerService.hide();
  }

  removeBatchAssign(topic) {
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
      a.download = 'BatchAssignReport.csv';
      a.click();
      window.URL.revokeObjectURL(url);
      a.remove();
    }
  }

}
