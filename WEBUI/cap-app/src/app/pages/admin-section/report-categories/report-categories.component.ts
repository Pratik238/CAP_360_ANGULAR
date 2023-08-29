import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { MessageService, LazyLoadEvent } from 'primeng/api';
import { User } from 'src/app/models/interfaces';
import { IAdminTableParams } from 'src/app/models/interfaces/admin-table';
import { AdminCommonEndpointsService } from 'src/app/services/admin-common-endpoints.service';
import { AuthenticationService } from 'src/app/services/authentication.service';

@Component({
  selector: 'app-report-categories',
  templateUrl: './report-categories.component.html',
  styleUrls: ['./report-categories.component.scss']
})
export class ReportCategoriesComponent implements OnInit {

  @ViewChild('addEditReportCategoriesFrom') addEditReportCategoriesFrom: ElementRef;
  @ViewChild('displayReportCategoriesFrom') displayReportCategoriesFrom: ElementRef;
  @ViewChild('displayWarningMessage') displayWarningMessage: ElementRef;

  selectedProducts: [];

  reportCategoriesFrom: FormGroup;
  submitted = false;

  subjects: any[] = [];

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

  allReportCategories: any[] = [];
  dataSource: any[] = [];
  totalRecords: number;
  csvData: any[] = [];
  topic: any;
  isAddMode = true;
  DifficultyLevelId = '';
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
    this.reportCategoriesFrom = this.fb.group({
      DifficultyLevelName: new FormControl('', Validators.required),
      SubjectId: new FormControl(null, Validators.required),
      IsActive: new FormControl(1, Validators.required),
    });
    this.loadReportCategories(this.lazyLoadEvent);
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
      this.spinnerService.hide();
    }, error => {
      this.spinnerService.hide();
    });
    this.user = this.authenticationService.userValue;
  }

  loadReportCategories(event: LazyLoadEvent) {
    this.spinnerService.show();
    this.adminCommonEndpointsService.getCommonLists('vw_Difficultylevel', 'Order by', 'DifficultyLevelId', 'ASC', this.isActiveRecord).subscribe(result => {
      this.dataSource = result;
      this.csvData = result;
      this.lazyLoadEvent = event;
      this.spinnerService.hide();
      // if (event && event.first && event.rows) {
      //   this.allReportCategories = this.dataSource.slice(event.first, (event.first + event.rows));
      // } else {
      //   this.allReportCategories = this.dataSource.slice(0, 10);
      // }

      this.allReportCategories = this.dataSource;
      // this.allReportCategories = this.dataSource.slice(event.first, (event.first + event.rows));
      this.totalRecords = this.dataSource.length;
    }, e => {
      this.spinnerService.hide();
      if (e['text']) {
        this.allReportCategories = [];
      }
    });
  }


  getLoadStatusRecords(status: boolean) {
    this.isActiveRecord = status;
    this.loadReportCategories(this.lazyLoadEvent);
  }

  createHomeWork() {
    this.isAddMode = true;
    this.modalService.open(this.addEditReportCategoriesFrom, {
      size: 'lg', windowClass: 'confirm-dialog-window',
      centered: true, backdrop: 'static', keyboard: false
    });
    this.reportCategoriesFrom.patchValue({
      IsActive: 1
    });
  }

  cancelHomework() {
    this.modalService.dismissAll();
    this.reportCategoriesFrom.reset();
  }

  allFormsValid() {
    return this.reportCategoriesFrom.valid;
  }

  closeModal() {
    this.reportCategoriesFrom.reset();
  }

  addReportCategory() {
    this.spinnerService.show();
    if (this.isAddMode) {
      const topicsParam: IAdminTableParams = {
        Table: 'DifficultyLevel',
        FilterFieldName: 'DifficultyLevelName',
        FilterFieldValue: this.reportCategoriesFrom.get('DifficultyLevelName').value,
        Data: [
          {
            FieldName: 'DifficultyLevelName',
            FieldValue: this.reportCategoriesFrom.get('DifficultyLevelName').value
          },
          {
            FieldName: 'SubjectId',
            FieldValue: this.reportCategoriesFrom.get('SubjectId').value
          },
          {
            FieldName: 'IsActive',
            FieldValue: this.reportCategoriesFrom.get('IsActive').value
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
        this.reportCategoriesFrom.reset();
        this.messageService.add({ severity: 'success', summary: result['message'], detail: '' });
        this.spinnerService.hide();
        this.loadReportCategories(this.lazyLoadEvent);
        this.modalService.dismissAll();
      }, (e) => {
        this.reportCategoriesFrom.reset();
        // this.messageService.add({ severity: 'error', summary: 'Error in while adding...', detail: '' });
        this.modalService.dismissAll();
        this.spinnerService.hide();
      });
    } else {

      const topicsParam: IAdminTableParams = {
        Table: 'DifficultyLevel',
        Data: [
          {
            FieldName: 'DifficultyLevelId',
            FieldValue: this.DifficultyLevelId
          },
          {
            FieldName: 'DifficultyLevelName',
            FieldValue: this.reportCategoriesFrom.get('DifficultyLevelName').value
          },
          {
            FieldName: 'SubjectId',
            FieldValue: this.reportCategoriesFrom.get('SubjectId').value
          },
          {
            FieldName: 'IsActive',
            FieldValue: this.reportCategoriesFrom.get('IsActive').value
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
      this.adminCommonEndpointsService.updateRecord(topicsParam).toPromise().then((result) => {
        this.reportCategoriesFrom.reset();
        this.messageService.add({ severity: 'success', summary: result['message'], detail: '' });
        this.spinnerService.hide();
        this.loadReportCategories(this.lazyLoadEvent);
        this.modalService.dismissAll();
      }, (e) => {
        this.reportCategoriesFrom.reset();
        // this.messageService.add({ severity: 'error', summary: 'Error in while updating...', detail: '' });
        this.modalService.dismissAll();
        this.spinnerService.hide();
      });
    }
  }

  editHomeWork(topic) {
    this.topic = topic;
    this.DifficultyLevelId = topic.DifficultyLevelId;
    this.reportCategoriesFrom.patchValue({
      SubjectId: topic.SubjectId,
      DifficultyLevelName: topic.DifficultyLevelName,
      IsActive: topic.IsActive ? 1 : 0,
    });
    this.isAddMode = false;
    this.modalService.open(this.addEditReportCategoriesFrom, {
      size: 'lg', windowClass: 'confirm-dialog-window',
      centered: true, backdrop: 'static', keyboard: false
    });
  }

  deleteHomework(subTopic) {
    this.spinnerService.show();
    const removeRecord = {
      Table: 'DifficultyLevel',
      PKey: subTopic.DifficultyLevelId
    };
    this.adminCommonEndpointsService.deleteRecord(removeRecord).subscribe(result => {
      this.messageService.add({ severity: 'success', summary: 'Report category removed successfully', detail: '' });
      this.spinnerService.hide();
      this.loadReportCategories(this.lazyLoadEvent);
      this.modalService.dismissAll();
    }, (e) => {
      // this.messageService.add({ severity: 'error', summary: 'Error in while removing...', detail: '' });
      this.modalService.dismissAll();
      this.spinnerService.hide();
    });
  }

  viewTopic(topic) {
    this.spinnerService.show();
    const viewRecord = {
      Table: 'DifficultyLevel',
      PKey: 'DifficultyLevelId',
      PKeyFld: topic.DifficultyLevelId
    };
    this.adminCommonEndpointsService.getRecordById(viewRecord).subscribe(result => {
      this.topic = result['message'][0];
      this.modalService.open(this.displayReportCategoriesFrom, {
        size: 'lg', windowClass: 'confirm-dialog-window',
        centered: true, backdrop: 'static', keyboard: false
      });
      this.spinnerService.hide();
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
      a.download = 'ReportCategories.csv';
      a.click();
      window.URL.revokeObjectURL(url);
      a.remove();
    }
  }

}
