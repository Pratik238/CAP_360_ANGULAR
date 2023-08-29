import { ITopics } from './../../../models/interfaces/topics';
import { IAdminTableParams } from './../../../models/interfaces/admin-table';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AdminCommonEndpointsService } from 'src/app/services/admin-common-endpoints.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { User } from 'src/app/models/interfaces';
import { LazyLoadEvent, MessageService } from 'primeng/api';

@Component({
  selector: 'app-topics',
  templateUrl: './topics.component.html',
  styleUrls: ['./topics.component.scss']
})
export class TopicsComponent implements OnInit {

  @ViewChild('reportInvalidQuestion') reportInvalidQuestion: ElementRef;
  @ViewChild('displayTopics') displayTopics: ElementRef;
  @ViewChild('displayWarningMessage') displayWarningMessage: ElementRef;

  topicsForm: FormGroup;
  searchTopicsForm: FormGroup;
  submitted = false;

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

  subjects: any[] = [];

  allTopicsArray: ITopics[] = [];
  topic: any;
  isAddMode = true;
  user: User;

  totalRecords: number;
  isActiveRecord: boolean = true;
  currentstatus: string = 'Active';
  lazyLoadEvent: any;
  dataSource: any[] = [];
  csvData: any[] = [];

  constructor(
    private adminCommonEndpointsService: AdminCommonEndpointsService,
    private fb: FormBuilder,
    private authenticationService: AuthenticationService,
    private spinnerService: NgxSpinnerService,
    private modalService: NgbModal,
    private messageService: MessageService) { }

  ngOnInit() {
    this.refreshData();

    // this.searchTopicsForm = this.fb.group({
    //   TopicName: new FormControl('', Validators.required),
    //   FromDate: new FormControl('', Validators.required),
    //   ToDate: new FormControl('', Validators.required)
    // });

    this.topicsForm = this.fb.group({
      SubjectId: new FormControl(null, Validators.required),
      TopicName: new FormControl('', Validators.required),
      TopicURL: new FormControl(''),
      IsActive: new FormControl(1, Validators.required),
    });
    this.loadTopics(this.lazyLoadEvent);

  }

  refreshData() {
    this.spinnerService.show();
    const dropdownObj = {
      dropdown: 'Subjects',
      sortby: 'SubjectName',
      selectfields: 'SubjectName as name,SubjectId as id'
    };
    this.adminCommonEndpointsService.getDropdowns(dropdownObj).subscribe(result => {
      this.subjects = result['message'];
    });
    this.user = this.authenticationService.userValue;
    this.spinnerService.hide();
  }

  onSearchData() {
    // console.log(this.searchTopicsForm.value);
  }

  loadTopics(event: LazyLoadEvent) {
    this.spinnerService.show();
    this.adminCommonEndpointsService.getCommonLists('vw_Topics', 'Order by', 'TopicId', 'ASC', this.isActiveRecord).subscribe(result => {
      this.dataSource = result;
      this.csvData = result;
      this.lazyLoadEvent = event;
      // if (event && event.first && event.rows) {
      //   this.allTopicsArray = this.dataSource.slice(event.first, (event.first + event.rows));
      // } else {
      //   this.allTopicsArray = this.dataSource.slice(0, 10);
      // }

      this.allTopicsArray = this.dataSource;
      // this.allTopicsArray = this.dataSource.slice(event.first, (event.first + event.rows));
      this.totalRecords = this.dataSource.length;
      this.spinnerService.hide();
    }, error => {
      this.spinnerService.hide();
    });
  }

  addTopic() {
    this.isAddMode = true;
    this.modalService.open(this.reportInvalidQuestion, {
      size: 'lg', windowClass: 'confirm-dialog-window',
      centered: true, backdrop: 'static', keyboard: false
    });

    this.topicsForm.patchValue({
      IsActive: 1
    });
  }

  closeModal() {
    this.topicsForm.reset();
  }

  cancelTopic() {
    this.modalService.dismissAll();
    this.topicsForm.reset();
  }

  topicFormValid() {
    return this.topicsForm.valid;
  }

  saveTopic() {
    this.spinnerService.show();
    if (this.isAddMode) {
      const topicObj = {
        subjectId: this.topicsForm.get('SubjectId').value,
        topicName: this.topicsForm.get('TopicName').value,
        topicUrl: this.topicsForm.get('TopicURL').value,
        isActive: this.topicsForm.get('IsActive').value,
      };

      const topicsParam: IAdminTableParams = {
        Table: 'Topics',
        FilterFieldName: 'TopicName',
        FilterFieldValue: topicObj.topicName,
        Data: [
          {
            FieldName: 'TopicName',
            FieldValue: topicObj.topicName
          },
          {
            FieldName: 'SubjectId',
            FieldValue: topicObj.subjectId
          },
          {
            FieldName: 'TopicURL',
            FieldValue: topicObj.topicUrl
          },
          {
            FieldName: 'IsActive',
            FieldValue: topicObj.isActive
          },
          {
            FieldName: 'Createdby',
            FieldValue: this.user.Name
          },
          {
            FieldName: 'Updatedby',
            FieldValue: this.user.Name
          }
        ]
      };
      this.adminCommonEndpointsService.addNewList(topicsParam).toPromise().then((result) => {
        this.messageService.add({ severity: 'success', summary: result['message'], detail: '' });
        this.loadTopics(this.lazyLoadEvent);
        this.topicsForm.reset();
        this.spinnerService.hide();
        this.modalService.dismissAll();
      }, (e) => {
        this.spinnerService.hide();
        // this.messageService.add({ severity: 'error', summary: 'Error in while adding...', detail: '' });
        this.modalService.dismissAll();
      });
    } else {
      const topicObj = {
        subjectId: this.topicsForm.get('SubjectId').value,
        topicName: this.topicsForm.get('TopicName').value,
        topicUrl: this.topicsForm.get('TopicURL').value,
        isActive: this.topicsForm.get('IsActive').value,
      };

      const topicsParam: IAdminTableParams = {
        Table: 'Topics',
        Data: [
          {
            FieldName: 'TopicId',
            FieldValue: this.topic.TopicId
          },
          {
            FieldName: 'TopicName',
            FieldValue: topicObj.topicName
          },
          {
            FieldName: 'SubjectId',
            FieldValue: topicObj.subjectId
          },
          {
            FieldName: 'TopicUrl',
            FieldValue: topicObj.topicUrl
          },
          {
            FieldName: 'IsActive',
            FieldValue: topicObj.isActive
          },
          {
            FieldName: 'Createdby',
            FieldValue: this.topic.Createdby
          },
          {
            FieldName: 'UpdatedBy',
            FieldValue: this.user.Name
          }
        ]
      };
      this.adminCommonEndpointsService.updateRecord(topicsParam).toPromise().then((result) => {
        this.messageService.add({ severity: 'success', summary: result['message'], detail: '' });
        this.topicsForm.reset();
        this.spinnerService.hide();
        this.loadTopics(this.lazyLoadEvent);
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
    this.topicsForm.patchValue({
      SubjectId: topic.SubjectId,
      TopicName: topic.TopicName,
      TopicURL: topic.TopicURL,
      IsActive: topic.IsActive ? 1 : 0,
    });
    this.isAddMode = false;
    this.modalService.open(this.reportInvalidQuestion, {
      size: 'lg', windowClass: 'confirm-dialog-window',
      centered: true, backdrop: 'static', keyboard: false
    });
  }

  deleteTopic(topic) {
    this.spinnerService.show();
    const removeRecord = {
      Table: 'Topics',
      PKey: topic.TopicId
    };
    this.adminCommonEndpointsService.deleteRecord(removeRecord).subscribe(result => {
      this.loadTopics(this.lazyLoadEvent);
      this.messageService.add({ severity: 'success', summary: 'Topic removed successfully', detail: '' });
      this.spinnerService.hide();
      this.modalService.dismissAll();
    }, (e) => {
      this.spinnerService.hide();
      // this.messageService.add({ severity: 'error', summary: 'Error in while removing...', detail: '' });
      this.modalService.dismissAll();
    });
  }

  getLoadStatusRecords(status: boolean) {
    this.isActiveRecord = status;
    this.loadTopics(this.lazyLoadEvent);
  }

  viewTopic(topic) {
    this.spinnerService.show();
    const viewRecord = {
      Table: 'Topics',
      PKey: 'TopicId',
      PKeyFld: topic.TopicId
    };
    this.adminCommonEndpointsService.getRecordById(viewRecord).subscribe(result => {
      this.topic = result[0];
      this.modalService.open(this.displayTopics, {
        size: 'lg', windowClass: 'confirm-dialog-window',
        centered: true, backdrop: 'static', keyboard: false
      });
      this.spinnerService.hide();
    }, (e) => {
      // this.messageService.add({ severity: 'error', summary: 'Error in while opening...', detail: '' });
      this.spinnerService.hide();
      this.modalService.dismissAll();
    });
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
      a.download = 'Topics.csv';
      a.click();
      window.URL.revokeObjectURL(url);
      a.remove();
    }
  }

}
