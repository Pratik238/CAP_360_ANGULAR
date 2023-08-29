import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { LazyLoadEvent, MessageService } from 'primeng/api';
import { rolesEnum } from 'src/app/models/Enum/roles';
import { User } from 'src/app/models/interfaces';
import { IAssignSATExam } from 'src/app/models/interfaces/admin-table';
import { AdminCommonEndpointsService } from 'src/app/services/admin-common-endpoints.service';
import { AuthenticationService } from 'src/app/services/authentication.service';

@Component({
  selector: 'app-tutor-sat-assign',
  templateUrl: './tutor-sat-assign.component.html',
  styleUrls: ['./tutor-sat-assign.component.scss']
})
export class TutorSatAssignComponent implements OnInit {

  @ViewChild('assignHomeworkForm') assignHomeworkForm: ElementRef;
  @ViewChild('displayTopics') displayTopics: ElementRef;
  @ViewChild('displayWarningMessage') displayWarningMessage: ElementRef;

  batchForm: FormGroup;
  searchSATAssignForm: FormGroup;
  submitted = false;

  topics: any[] = [];

  allSatExamData: any[] = [];
  dataSource: any[] = [];
  csvData: any[] = [];
  lazyLoadEvent: any;
  topic: any;
  user: User;
  isAddMode = true;
  homeworkData: any[] = [];
  allStudents: any[] = [];
  subTopics: any[] = [];

  batches: any[] = [];
  totalRecords: number = 0;
  currentstatus = 'true';

  constructor(private fb: FormBuilder,
    private adminCommonEndpointsService: AdminCommonEndpointsService,
    private authenticationService: AuthenticationService,
    private spinnerService: NgxSpinnerService,
    private modalService: NgbModal,
    private messageService: MessageService) { }

  ngOnInit() {
    // this.searchSATAssignForm = this.fb.group({
    //   BatchId: new FormControl(null),
    //   TutorName: new FormControl(''),
    //   SubTopicName: new FormControl(''),
    // });

    this.refreshData();
    this.batchForm = this.fb.group({
      BatchId: new FormControl(null, Validators.required),
      SubTopicId: new FormControl(null, Validators.required),
    });
    this.loadSatExamData(this.lazyLoadEvent);
  }

  refreshData() {
    this.spinnerService.show();
    this.user = this.authenticationService.userValue;
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

    this.adminCommonEndpointsService.getCommonLists('SubTopics', 'Order by', 'SubTopicId', 'ASC', true).subscribe(result => {
      this.subTopics = result;
      this.spinnerService.hide();
    }, error => {
      this.spinnerService.hide();
    });
  }

  onSearchData() { }

  loadSatExamData(event: LazyLoadEvent, status = 'true') {
    this.spinnerService.show();
    this.lazyLoadEvent = event;
    this.currentstatus = status;
    this.adminCommonEndpointsService.getCommonLists('vw_SATExamAssign', 'Order by', 'SATExamAssignId', 'ASC', this.currentstatus).subscribe(result => {
      if (this.user.Usertype === rolesEnum.SuperAdmin) {
        this.dataSource = result;
      } else if (this.user.Usertype === rolesEnum.CenterAdmin) {
        this.dataSource = result.filter(x => x.CenterAdminId === this.user.UserId);
      } else {
        this.dataSource = result.filter(x => x.TutorId === this.user.UserId);
      }
      this.csvData = JSON.parse(JSON.stringify(this.dataSource));
      // if (event && event.first && event.rows) {
      //   this.allSatExamData = this.dataSource.slice(event.first, (event.first + event.rows));
      // } else {
      //   this.allSatExamData = this.dataSource.slice(0, 10);
      // }

      this.allSatExamData = this.dataSource;
      // this.allSatExamData = this.dataSource.slice(event.first, (event.first + event.rows));
      this.totalRecords = this.dataSource.length;
      this.spinnerService.hide();
    }, error => {
      this.spinnerService.hide();
    });
  }

  allFormsValid() {
    return this.batchForm.valid;
  }

  assignHomework() {
    this.modalService.open(this.assignHomeworkForm, {
      size: 'lg', windowClass: 'confirm-dialog-window',
      centered: true, backdrop: 'static', keyboard: false
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
    if (this.isAddMode) {
      const assignBatch: IAssignSATExam = {
        BatchId: this.batchForm.get('BatchId').value,
        SubTopicId: this.batchForm.get('SubTopicId').value,
        Createdby: this.user.Name,
        Updatedby: this.user.Name
      };
      this.spinnerService.show();

      this.adminCommonEndpointsService.assignSatExam(assignBatch).toPromise().then((result) => {

        this.spinnerService.hide();
        this.messageService.add({ severity: 'success', summary: 'SAT Assigned successfully', detail: '' });
        this.refreshData();
        this.loadSatExamData(this.lazyLoadEvent);
        this.batchForm.reset();
        this.modalService.dismissAll();
      }, (e) => {
        this.spinnerService.hide();
        // this.messageService.add({ severity: 'error', summary: 'Error in while assiging...', detail: '' });

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
      a.download = 'SatAssignReport.csv';
      a.click();
      window.URL.revokeObjectURL(url);
      a.remove();
    }
  }

}
