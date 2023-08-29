import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AdminCommonEndpointsService } from 'src/app/services/admin-common-endpoints.service';
import { IAdminTableParams } from 'src/app/models/interfaces/admin-table';
import { NgxSpinnerService } from 'ngx-spinner';
import { User } from 'src/app/models/interfaces';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { LazyLoadEvent } from 'primeng/api/lazyloadevent';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-sub-topic',
  templateUrl: './sub-topic.component.html',
  styleUrls: ['./sub-topic.component.scss']
})
export class SubTopicComponent implements OnInit {

  @ViewChild('addNewSubTopicForm') addNewSubTopicForm: ElementRef;
  @ViewChild('displayTopics') displayTopics: ElementRef;
  @ViewChild('displayWarningMessage') displayWarningMessage: ElementRef;

  selectedProducts: [];

  value: Date;

  subTopicsForm: FormGroup;
  searchSubTopicsForm: FormGroup;
  submitted = false;

  topics: any[] = [];
  duplicateTopics: any[] = [];

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


  dataSource: any[] = [];
  csvData: any[] = [];
  allSubTopics: any[] = [];
  subjects: any[] = [];
  subTopic: any;
  isAddMode = true;
  subTopicId = '';
  user: User;

  totalRecords: number;
  loading: boolean = true;
  lazyLoadEvent: any;

  isActiveRecord: boolean = true;
  currentstatus: string = 'Active';

  constructor(private adminCommonEndpointsService: AdminCommonEndpointsService,
    private fb: FormBuilder,
    private authenticationService: AuthenticationService,
    private spinnerService: NgxSpinnerService,
    private modalService: NgbModal,
    private messageService: MessageService) {
  }

  ngOnInit() {
    this.refreshData();
    // this.searchSubTopicsForm = this.fb.group({
    //   TopicId: new FormControl(null, Validators.required),
    //   SubTopicName: new FormControl('', Validators.required),
    //   FromDate: new FormControl('', Validators.required),
    //   ToDate: new FormControl('', Validators.required)
    // });
    this.subTopicsForm = this.fb.group({
      SubTopicName: new FormControl('', Validators.required),
      SubTopicURL: new FormControl(''),
      TopicId: new FormControl(null, Validators.required),
      SubjectId: new FormControl(null, Validators.required),
      IsActive: new FormControl(1, Validators.required)
    });
    this.loadSubTopics(this.lazyLoadEvent);

  }

  refreshData() {
    this.spinnerService.show();
    const subjectDropdownObj = {
      dropdown: 'Subjects',
      sortby: 'SubjectName',
      selectfields: 'SubjectName as name,SubjectId as id'
    };
    this.adminCommonEndpointsService.getDropdowns(subjectDropdownObj).subscribe(result => {
      this.subjects = result['message'];
      this.spinnerService.hide();
    }, error => {

      this.spinnerService.hide();
    });

    this.adminCommonEndpointsService.getCommonLists('Topics', 'Order by', 'TopicId', 'ASC', true).subscribe(result => {
      this.topics = result;
      this.duplicateTopics = result;
      this.spinnerService.hide();
    }, error => {

      this.spinnerService.hide();
    });
    this.user = this.authenticationService.userValue;
    this.spinnerService.hide();
  }

  onSearchData() {
    // console.log(this.searchSubTopicsForm.value);
  }

  loadSubTopics(event: LazyLoadEvent) {
    this.loading = true;
    this.spinnerService.show();
    this.adminCommonEndpointsService.getCommonLists('vw_SubTopics', 'Order by', 'SubTopicId', 'ASC', this.isActiveRecord).subscribe(result => {
      this.dataSource = result;
      this.csvData = result;
      this.lazyLoadEvent = event;
      // if (event && event.first && event.rows) {
      //   this.allSubTopics = this.dataSource.slice(event.first, (event.first + event.rows));
      // } else {
      //   this.allSubTopics = this.dataSource.slice(0, 10);
      // }

      this.allSubTopics = this.dataSource;
      //  this.allSubTopics = this.dataSource.slice(event.first, (event.first + event.rows));
      this.totalRecords = this.dataSource.length;
      this.loading = false;
      this.spinnerService.hide();
    }, error => {

      this.spinnerService.hide();
    });
  }

  onChangeSubject(event) {
    if (event.target.value !== null && event.target.value !== '' && event.target.value !== undefined) {
      this.topics = this.duplicateTopics.filter(x => Number(x.SubjectId) === Number(event.target.value));
    }
  }

  addNewSubTopic() {
    this.isAddMode = true;
    this.modalService.open(this.addNewSubTopicForm, {
      size: 'lg', windowClass: 'confirm-dialog-window',
      centered: true, backdrop: 'static', keyboard: false
    });
    this.subTopicsForm.patchValue({
      IsActive: 1
    });
  }

  getLoadStatusRecords(status: boolean) {
    this.isActiveRecord = status;
    this.loadSubTopics(this.lazyLoadEvent);
  }

  cancelTopic() {
    this.subTopicsForm.reset();
    this.modalService.dismissAll();
  }

  allFormsValid() {
    return this.subTopicsForm.valid;
  }

  closeModal() {
    this.subTopicsForm.reset();
  }

  saveTopic() {
    this.spinnerService.show();
    if (this.isAddMode) {
      const topicObj = {
        SubTopicName: this.subTopicsForm.get('SubTopicName').value,
        TopicId: this.subTopicsForm.get('TopicId').value,
        SubTopicURL: this.subTopicsForm.get('SubTopicURL').value,
        IsActive: this.subTopicsForm.get('IsActive').value,
      };
      const topicsParam: IAdminTableParams = {
        Table: 'SubTopics',
        FilterFieldName: 'SubTopicName',
        FilterFieldValue: topicObj.SubTopicName,
        Data: [
          {
            FieldName: 'SubTopicName',
            FieldValue: topicObj.SubTopicName
          },
          {
            FieldName: 'TopicId',
            FieldValue: topicObj.TopicId
          },
          {
            FieldName: 'SubTopicURL',
            FieldValue: topicObj.SubTopicURL
          },
          {
            FieldName: 'IsActive',
            FieldValue: topicObj.IsActive
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
      this.adminCommonEndpointsService.addNewList(topicsParam).toPromise().then((result) => {
        this.messageService.add({ severity: 'success', summary: result['message'], detail: '' });
        this.subTopicsForm.reset();
        this.spinnerService.hide();
        this.loadSubTopics(this.lazyLoadEvent);
        this.modalService.dismissAll();
      }, (e) => {
        // this.messageService.add({ severity: 'error', summary: 'Error in while adding...', detail: '' });
        this.modalService.dismissAll();
      });
    } else {
      const topicObj = {
        SubTopicName: this.subTopicsForm.get('SubTopicName').value,
        TopicId: this.subTopicsForm.get('TopicId').value,
        SubTopicURL: this.subTopicsForm.get('SubTopicURL').value,
        IsActive: this.subTopicsForm.get('IsActive').value,
      };

      const topicsParam: IAdminTableParams = {
        Table: 'SubTopics',
        Data: [
          {
            FieldName: 'SubTopicId',
            FieldValue: this.subTopicId
          },
          {
            FieldName: 'SubTopicName',
            FieldValue: topicObj.SubTopicName
          },
          {
            FieldName: 'TopicId',
            FieldValue: topicObj.TopicId
          },
          {
            FieldName: 'SubTopicURL',
            FieldValue: topicObj.SubTopicURL
          },
          {
            FieldName: 'IsActive',
            FieldValue: topicObj.IsActive
          },
          {
            FieldName: 'Createdby',
            FieldValue: this.subTopic.Createdby
          },
          {
            FieldName: 'UpdatedBy',
            FieldValue: this.user.Name
          }
        ]
      };
      this.adminCommonEndpointsService.updateRecord(topicsParam).toPromise().then((result) => {
        this.messageService.add({ severity: 'success', summary: result['message'], detail: '' });
        this.subTopicsForm.reset();
        this.spinnerService.hide();
        this.loadSubTopics(this.lazyLoadEvent);
        this.modalService.dismissAll();
      }, (e) => {
        // this.messageService.add({ severity: 'error', summary: 'Error in while updating...', detail: '' });
        this.modalService.dismissAll();
      });
    }
  }

  editTopic(subTopic) {
    this.subTopic = subTopic;
    this.subTopicId = subTopic.SubTopicId;
    this.subTopicsForm.patchValue({
      TopicId: subTopic.TopicId,
      SubTopicName: subTopic.SubTopicName,
      SubTopicURL: subTopic.SubTopicURL,
      SubjectId: subTopic.SubjectId,
      IsActive: subTopic.IsActive ? 1 : 0,
    });
    this.isAddMode = false;
    this.modalService.open(this.addNewSubTopicForm, {
      size: 'lg', windowClass: 'confirm-dialog-window',
      centered: true, backdrop: 'static', keyboard: false
    });
  }

  deleteTopic(subTopic) {
    this.spinnerService.show();
    const removeRecord = {
      Table: 'SubTopics',
      PKey: subTopic.SubTopicId
    };
    this.adminCommonEndpointsService.deleteRecord(removeRecord).subscribe(result => {
      this.messageService.add({ severity: 'success', summary: 'Sub Topic removed successfully', detail: '' });
      this.spinnerService.hide();
      this.loadSubTopics(this.lazyLoadEvent);
      this.modalService.dismissAll();
    }, (e) => {
      this.spinnerService.hide();
      // this.messageService.add({ severity: 'error', summary: 'Error in while removing...', detail: '' });
      this.modalService.dismissAll();
    });
  }

  viewTopic(subTopic) {
    this.spinnerService.show();
    const viewRecord = {
      Table: 'SubTopics',
      PKey: 'SubTopicId',
      PKeyFld: subTopic.SubTopicId
    };
    this.adminCommonEndpointsService.getRecordById(viewRecord).subscribe(result => {
      this.spinnerService.hide();
      this.subTopic = result[0];
      this.modalService.open(this.displayTopics, {
        size: 'lg', windowClass: 'confirm-dialog-window',
        centered: true, backdrop: 'static', keyboard: false
      });
    }, error => {
      this.spinnerService.hide();
    });
  }

  removeTopic(subTopic) {
    this.subTopic = subTopic;
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
      a.download = 'SubTopicsReport.csv';
      a.click();
      window.URL.revokeObjectURL(url);
      a.remove();
    }
  }

}
