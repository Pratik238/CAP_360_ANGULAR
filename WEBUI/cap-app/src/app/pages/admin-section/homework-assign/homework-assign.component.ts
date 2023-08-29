import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { LazyLoadEvent, MessageService } from 'primeng/api';
import { rolesEnum } from 'src/app/models/Enum/roles';
import { User } from 'src/app/models/interfaces';
import { IAssignHomework } from 'src/app/models/interfaces/admin-table';
import { AdminCommonEndpointsService } from 'src/app/services/admin-common-endpoints.service';
import { AuthenticationService } from 'src/app/services/authentication.service';

@Component({
  selector: 'app-homework-assign',
  templateUrl: './homework-assign.component.html',
  styleUrls: ['./homework-assign.component.scss']
})
export class HomeworkAssignComponent implements OnInit {

  @ViewChild('assignHomeworkForm') assignHomeworkForm: ElementRef;
  @ViewChild('displayHomeworkDetails') displayHomeworkDetails: ElementRef;
  @ViewChild('displayWarningMessage') displayWarningMessage: ElementRef;

  batchForm: FormGroup;
  searchBatchForm: FormGroup;
  submitted = false;

  topics: any[] = [];
  currentstatus = 'true';
  allHomeworkDetails: any[] = [];
  dataSource: any[] = [];
  csvData: any[] = [];
  lazyLoadEvent: any;
  homeworkDetails: any;
  user: User;
  isAddMode = true;
  duplicateHomeworks: any[] = [];
  homeworkData: any[] = [];
  allStudents: any[] = [];
  subTopics: any[] = [];

  batches: any[] = [];
  totalRecords: number = 0;

  constructor(private fb: FormBuilder,
    private adminCommonEndpointsService: AdminCommonEndpointsService,
    private authenticationService: AuthenticationService,
    private spinnerService: NgxSpinnerService,
    private modalService: NgbModal,
    private messageService: MessageService) { }

  ngOnInit() {
    // this.searchBatchForm = this.fb.group({
    //   BatchId: new FormControl(null),
    //   TutorName: new FormControl(''),
    //   HomeWorkName: new FormControl(''),
    // });

    this.refreshData();
    this.batchForm = this.fb.group({
      BatchId: new FormControl(null, Validators.required),
      SubTopicId: new FormControl(null, Validators.required),
      HomeWorkIds: new FormControl(null, Validators.required)
    });
    this.loadHomeworkData(this.lazyLoadEvent);
  }

  refreshData() {
    this.spinnerService.show();
    this.user = this.authenticationService.userValue;
    this.adminCommonEndpointsService.getCommonLists('vw_Batches', 'Order by', 'BatchId', 'ASC', true).subscribe(result => {
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
    this.adminCommonEndpointsService.getCommonLists('HomeWork', 'Order by', 'HomeWorkId', 'ASC', true).subscribe(result => {
      this.duplicateHomeworks = result;
      this.spinnerService.hide();
    }, error => {
      this.spinnerService.hide();
    });

    this.adminCommonEndpointsService.getCommonLists('SubTopics', 'Order by', 'SubTopicId', 'ASC', true).subscribe(result => {
      this.subTopics = result;
      this.spinnerService.hide();
    }, error => {
      this.spinnerService.hide();
    });
  }

  onSearchData() { }

  loadHomeworkData(event: LazyLoadEvent, status = 'true') {
    this.spinnerService.show();
    this.lazyLoadEvent = event;
    this.currentstatus = status;
    this.adminCommonEndpointsService.getCommonLists('vw_HomeWorkAssign', 'Order by', 'HomeWorkAssignId', 'ASC', this.currentstatus).subscribe(result => {
      this.allHomeworkDetails = result.filter(x => x.TutorId === this.user.UserId);
      if (this.user.Usertype === rolesEnum.SuperAdmin) {
        this.dataSource = result;
      } else if (this.user.Usertype === rolesEnum.CenterAdmin) {
        this.dataSource = result.filter(x => x.CenterAdminId === this.user.UserId);
      } else {
        this.dataSource = result.filter(x => x.TutorId === this.user.UserId);
      }
      this.csvData = JSON.parse(JSON.stringify(this.dataSource));
      // if (event && event.first && event.rows) {
      //   this.allHomeworkDetails = this.dataSource.slice(event.first, (event.first + event.rows));
      // } else {
      //   this.allHomeworkDetails = this.dataSource.slice(0, 10);
      // }

      this.allHomeworkDetails = this.dataSource;
      // this.allHomeworkDetails = this.dataSource.slice(event.first, (event.first + event.rows));
      this.totalRecords = this.dataSource.length;
      this.spinnerService.hide();
    }, error => {
      this.spinnerService.hide();
    });
  }

  onChangeSubTopic(event) {
    if (event.target.value !== null) {
      const filteredHomewroks = this.duplicateHomeworks.filter(x => x.SubTopicId.toString() === event.target.value.toString());
      this.homeworkData = filteredHomewroks;
    } else {
      this.homeworkData = [];
    }
  }

  allFormsValid() {
    return this.batchForm.valid;
  }

  closeModal() {
    this.batchForm.reset();
  }

  assignHomework() {
    this.modalService.open(this.assignHomeworkForm, {
      size: 'lg', windowClass: 'confirm-dialog-window',
      centered: true, backdrop: 'static', keyboard: false
    });
  }

  cancelBatch() {
    this.modalService.dismissAll();
    this.batchForm.reset();
  }

  topicFormValid() {
    return this.batchForm.valid;
  }

  saveBatch() {
    if (this.isAddMode) {
      const assignBatch: IAssignHomework = {
        BatchId: this.batchForm.get('BatchId').value,
        HomeWorkIds: this.batchForm.get('HomeWorkIds').value,
        Createdby: this.user.Name,
        Updatedby: this.user.Name
      };

      this.spinnerService.show();
      this.adminCommonEndpointsService.assignHomework(assignBatch).toPromise().then((result) => {
        this.messageService.add({ severity: 'success', summary: result['message'], detail: '' });
        this.refreshData();
        this.loadHomeworkData(this.lazyLoadEvent);
        this.batchForm.reset();
        this.spinnerService.hide();
        this.modalService.dismissAll();
      }, (e) => {
        this.spinnerService.hide();
        // this.messageService.add({ severity: 'error', summary: 'Error in while assigning...', detail: '' });
        this.modalService.dismissAll();
      });
    }
  }

  editTopic(topic) {
    this.homeworkDetails = topic;
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

  deleteBatch(subTopic) {
    this.spinnerService.show();
    const findIndex = this.allHomeworkDetails.findIndex(x => x.BatchName === subTopic.BatchName);
    this.allHomeworkDetails.splice(findIndex, 1);
    this.messageService.add({ severity: 'success', summary: 'Successfully removed...!', detail: '' });
    this.spinnerService.hide();
    this.modalService.dismissAll();
  }

  viewTopic(topic) {
    this.spinnerService.show();
    const viewRecord = {
      Table: 'vw_HomeWorkAssign',
      PKey: 'HomeWorkAssignId',
      PKeyFld: topic.HomeWorkAssignId
    };
    this.adminCommonEndpointsService.getRecordById(viewRecord).subscribe(result => {
      this.homeworkDetails = result[0];
      this.modalService.open(this.displayHomeworkDetails, {
        size: 'lg', windowClass: 'confirm-dialog-window',
        centered: true, backdrop: 'static', keyboard: false
      });
      this.spinnerService.hide();
    }, (e) => {
      // this.messageService.add({ severity: 'error', summary: 'Error in while updating...', detail: '' });
      this.spinnerService.hide();
      this.modalService.dismissAll();
    });

  }

  removeTopic(topic) {
    this.homeworkDetails = topic;
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
      a.download = 'HomeworkAssign.csv';
      a.click();
      window.URL.revokeObjectURL(url);
      a.remove();
    }
  }

}
