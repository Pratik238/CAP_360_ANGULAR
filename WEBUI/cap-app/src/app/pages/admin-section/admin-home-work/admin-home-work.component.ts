import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { LazyLoadEvent, MessageService } from 'primeng/api';
import { User } from 'src/app/models/interfaces';
import { IAdminTableParams } from 'src/app/models/interfaces/admin-table';
import { AdminCommonEndpointsService } from 'src/app/services/admin-common-endpoints.service';
import { AuthenticationService } from 'src/app/services/authentication.service';

@Component({
  selector: 'app-admin-home-work',
  templateUrl: './admin-home-work.component.html',
  styleUrls: ['./admin-home-work.component.scss']
})
export class AdminHomeWorkComponent implements OnInit {


  @ViewChild('addEditHomeWorkForm') addEditHomeWorkForm: ElementRef;
  @ViewChild('displayHomeworks') displayHomeworks: ElementRef;
  @ViewChild('displayWarningMessage') displayWarningMessage: ElementRef;

  selectedProducts: [];

  homeworkForm: FormGroup;
  searchHomeworkForm: FormGroup;
  submitted = false;

  SubTopics: any[] = [];
  duplicateSubTopics: any[] = [];

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

  allTopicsArray: any[] = [];
  dataSource: any[] = [];
  subjects: any[] = [];
  csvData: any[] = [];
  totalRecords: number;
  topic: any;
  isAddMode = true;
  HomeWorkId = '';
  user: User;
  isActiveRecord: boolean = true;
  currentstatus: string = 'Active';
  lazyLoadEvent: any;

  constructor(private adminCommonEndpointsService: AdminCommonEndpointsService,
    private fb: FormBuilder,
    private authenticationService: AuthenticationService,
    private spinnerService: NgxSpinnerService,
    private modalService: NgbModal,
    private messageService: MessageService) { }

  ngOnInit() {
    this.refreshData();
    // this.searchHomeworkForm = this.fb.group({
    //   HomeWorkName: new FormControl('', Validators.required),
    //   SubTopicId: new FormControl(null, Validators.required),
    //   FromDate: new FormControl('', Validators.required),
    //   ToDate: new FormControl('', Validators.required)
    // });
    this.homeworkForm = this.fb.group({
      HomeWorkName: new FormControl('', Validators.required),
      SubjectId: new FormControl(null, Validators.required),
      SubTopicId: new FormControl(null, Validators.required),
      IsActive: new FormControl(1, Validators.required),
    });
    this.laodHomeWorkData(this.lazyLoadEvent);

  }

  refreshData() {
    this.spinnerService.show();
    const subjectDropdownObj = {
      dropdown: 'Subjects',
      sortby: 'SubjectName',
      selectfields: 'SubjectName as name,SubjectId as id'
    };
    this.adminCommonEndpointsService.getDropdowns(subjectDropdownObj).subscribe(result => {
      this.spinnerService.hide();
      this.subjects = result['message'];
    }, error => {
      this.spinnerService.hide();
    });
    this.adminCommonEndpointsService.getCommonLists('vw_SubTopics', 'Order by', 'SubTopicId', 'ASC', this.isActiveRecord).subscribe(result => {
      this.spinnerService.hide();
      this.SubTopics = result;
      this.duplicateSubTopics = result;
    }, error => {
      this.spinnerService.hide();
    });
    this.user = this.authenticationService.userValue;
  }

  onSearchData() {
    // console.log(this.searchHomeworkForm.value);
  }

  laodHomeWorkData(event: LazyLoadEvent) {
    this.spinnerService.show();
    this.adminCommonEndpointsService.getCommonLists('vw_HomeWork', 'Order by', 'HomeWorkId', 'ASC', this.isActiveRecord).subscribe(result => {
      this.spinnerService.hide();
      this.dataSource = result;
      this.csvData = result;
      this.lazyLoadEvent = event;
      // if (event && event.first && event.rows) {
      //   this.allTopicsArray = this.dataSource.slice(event.first, (event.first + event.rows));
      // } else {
      //   this.allTopicsArray = this.dataSource.slice(0, 10);
      // }

      this.allTopicsArray = result;
      // this.allTopicsArray = this.dataSource.slice(event.first, (event.first + event.rows));
      this.totalRecords = this.dataSource.length;
    }, error => {
      this.spinnerService.hide();
    });
  }


  getLoadStatusRecords(status: boolean) {
    this.isActiveRecord = status;
    this.laodHomeWorkData(this.lazyLoadEvent);
  }

  getSubTopicnameById(SubTopicId: string) {
    return this.SubTopics && this.SubTopics.filter(x => x.id === SubTopicId).length > 0
      ? this.SubTopics.find(x => x.id === SubTopicId).name
      : '--';
  }

  createHomeWork() {
    this.isAddMode = true;
    this.modalService.open(this.addEditHomeWorkForm, {
      size: 'lg', windowClass: 'confirm-dialog-window',
      centered: true, backdrop: 'static', keyboard: false
    });
    this.homeworkForm.patchValue({
      IsActive: 1
    });
  }

  cancelHomework() {
    this.modalService.dismissAll();
    this.homeworkForm.reset();
  }

  onChangeSubject(event) {
    if (event.target.value !== null && event.target.value !== '' && event.target.value !== undefined) {
      this.SubTopics = this.duplicateSubTopics.filter(x => Number(x.SubjectId) === Number(event.target.value));
    }
  }

  allFormsValid() {
    return this.homeworkForm.valid;
  }

  closeModal() {
    this.homeworkForm.reset();
  }

  saveHomework() {
    if (this.isAddMode) {
      const topicsParam: IAdminTableParams = {
        Table: 'HomeWork',
        FilterFieldName: 'HomeWorkName',
        FilterFieldValue: this.homeworkForm.get('HomeWorkName').value,
        Data: [
          {
            FieldName: 'HomeWorkName',
            FieldValue: this.homeworkForm.get('HomeWorkName').value
          },
          {
            FieldName: 'SubTopicId',
            FieldValue: this.homeworkForm.get('SubTopicId').value
          },
          {
            FieldName: 'IsActive',
            FieldValue: this.homeworkForm.get('IsActive').value
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
        this.homeworkForm.reset();
        this.spinnerService.hide();
        this.laodHomeWorkData(this.lazyLoadEvent);
        this.modalService.dismissAll();
      }, (e) => {
        this.spinnerService.hide();
        // this.messageService.add({ severity: 'error', summary: 'Error in while adding...', detail: '' });
        this.modalService.dismissAll();
      });
    } else {

      const topicsParam: IAdminTableParams = {
        Table: 'HomeWork',
        Data: [
          {
            FieldName: 'HomeWorkId',
            FieldValue: this.HomeWorkId
          },
          {
            FieldName: 'HomeWorkName',
            FieldValue: this.homeworkForm.get('HomeWorkName').value
          },
          {
            FieldName: 'SubTopicId',
            FieldValue: this.homeworkForm.get('SubTopicId').value
          },
          {
            FieldName: 'IsActive',
            FieldValue: this.homeworkForm.get('IsActive').value
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
        this.homeworkForm.reset();
        this.spinnerService.hide();
        this.laodHomeWorkData(this.lazyLoadEvent);
        this.modalService.dismissAll();
      }, (e) => {
        this.spinnerService.hide();
        // this.messageService.add({ severity: 'error', summary: 'Error in while updating...', detail: '' });
        this.modalService.dismissAll();
      });
    }
  }

  editHomeWork(topic) {
    this.topic = topic;
    this.HomeWorkId = topic.HomeWorkId;
    this.homeworkForm.patchValue({
      SubTopicId: topic.SubTopicId,
      HomeWorkName: topic.HomeWorkName,
      SubTopicURL: topic.SubTopicURL,
      SubjectId: topic.SubjectId,
      IsActive: topic.IsActive ? 1 : 0,
    });
    this.isAddMode = false;
    this.modalService.open(this.addEditHomeWorkForm, {
      size: 'lg', windowClass: 'confirm-dialog-window',
      centered: true, backdrop: 'static', keyboard: false
    });
  }

  deleteHomework(subTopic) {
    this.spinnerService.show();
    const removeRecord = {
      Table: 'HomeWork',
      PKey: subTopic.HomeWorkId
    };
    this.adminCommonEndpointsService.deleteRecord(removeRecord).subscribe(result => {
      this.messageService.add({ severity: 'success', summary: 'Sub Topic removed successfully', detail: '' });
      this.spinnerService.hide();
      this.laodHomeWorkData(this.lazyLoadEvent);
      this.modalService.dismissAll();
    }, (e) => {
      this.spinnerService.hide();
      // this.messageService.add({ severity: 'error', summary: 'Error in while removing...', detail: '' });
      this.modalService.dismissAll();
    });
  }

  viewTopic(topic) {
    this.spinnerService.show();
    const viewRecord = {
      Table: 'vw_HomeWork',
      PKey: 'HomeWorkId',
      PKeyFld: topic.HomeWorkId
    };
    this.adminCommonEndpointsService.getRecordById(viewRecord).subscribe(result => {
      this.spinnerService.hide();
      this.topic = result['message'][0];
      this.modalService.open(this.displayHomeworks, {
        size: 'lg', windowClass: 'confirm-dialog-window',
        centered: true, backdrop: 'static', keyboard: false
      });
    }, error => {
      this.spinnerService.hide();
    });
  }

  removeHomework(topic) {
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
      a.download = 'Homework.csv';
      a.click();
      window.URL.revokeObjectURL(url);
      a.remove();
    }
  }


}
