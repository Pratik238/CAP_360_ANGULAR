import { DatePipe } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { LazyLoadEvent, MessageService } from 'primeng/api';
import { rolesEnum } from 'src/app/models/Enum/roles';
import { User } from 'src/app/models/interfaces';
import { IAdminTableParams } from 'src/app/models/interfaces/admin-table';
import { ITopics } from 'src/app/models/interfaces/topics';
import { AdminCommonEndpointsService } from 'src/app/services/admin-common-endpoints.service';
import { AuthenticationService } from 'src/app/services/authentication.service';
import * as moment from 'moment';

@Component({
  selector: 'app-tutor-online-class',
  templateUrl: './tutor-online-class.component.html',
  styleUrls: ['./tutor-online-class.component.scss']
})
export class TutorOnlineClassComponent implements OnInit {

  @ViewChild('reportInvalidQuestion') reportInvalidQuestion: ElementRef;
  @ViewChild('displayTopics') displayTopics: ElementRef;
  @ViewChild('displayWarningMessage') displayWarningMessage: ElementRef;

  onlineClassForm: FormGroup;
  searchOnlineClassForm: FormGroup;
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

  allOnlineClass: any[] = [];
  dataSource: any[] = [];
  csvData: any[] = [];
  lazyLoadEvent: any;
  selectedOnlineClass: any;
  isAddMode = true;
  user: User;
  batches: any[] = [];
  loading: boolean = false;
  totalRecords: number = 0;
  subTopics: any[] = [];
  datePipe = new DatePipe('en-US');

  constructor(
    private adminCommonEndpointsService: AdminCommonEndpointsService,
    private fb: FormBuilder,
    private authenticationService: AuthenticationService,
    private spinnerService: NgxSpinnerService,
    private modalService: NgbModal,
    private messageService: MessageService) { }

  ngOnInit() {
    // this.searchOnlineClassForm = this.fb.group({
    //   BatchId: new FormControl(null, Validators.required),
    //   TutorName: new FormControl('', Validators.required),
    //   CenteradminId: new FormControl(null, Validators.required),
    // });

    this.refreshData();

    this.onlineClassForm = this.fb.group({
      BatchId: new FormControl(null, Validators.required),
      Link: new FormControl('', Validators.required),
      SubTopicId: new FormControl(null, Validators.required),
      StartDtTime: new FormControl(null, Validators.required),
      EndDtTime: new FormControl(null, Validators.required),
    }, { validator: this.dateLessThan('StartDtTime', 'EndDtTime') });
    this.loadOnlieClassData(this.lazyLoadEvent);
  }


  dateLessThan(from: string, to: string) {
    return (group: FormGroup): { [key: string]: any } => {
      //  let f = group.controls[from];
      //  let t = group.controls[to];
      let f = this.datePipe.transform(group.controls[from].value, 'MM/dd/yy h:mm');
      let t = this.datePipe.transform(group.controls[to].value, 'MM/dd/yy h:mm');
      if (Date.parse(f) >= Date.parse(t)) {
        return {
          dates: "Start Date should be less than End Date"
        };
      } else {
        return {};
      }
      //  if (moment(f).isAfter(t)) {
      //   return { 'error': 'Wrong period!' };        
      // }
    }
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

  onSearchData() {

  }

  loadOnlieClassData(event: LazyLoadEvent, status = 'true') {
    this.loading = true;
    this.spinnerService.show();
    this.currentstatus = status;
    this.lazyLoadEvent = event;
    this.adminCommonEndpointsService.getCommonLists('vw_Links', 'Order by', 'Id', 'ASC', this.currentstatus).subscribe(result => {
      if (this.user.Usertype === rolesEnum.SuperAdmin) {
        this.dataSource = result;
      } else if (this.user.Usertype === rolesEnum.CenterAdmin) {
        this.dataSource = result.filter(x => x.CenterAdminId === this.user.UserId);
      } else {
        this.dataSource = result.filter(x => x.TutorId === this.user.UserId);
      }
      this.spinnerService.hide();
      this.csvData = result;
      // if (event && event.first && event.rows) {
      //   this.allOnlineClass = this.dataSource.slice(event.first, (event.first + event.rows));
      // } else {
      //   this.allOnlineClass = this.dataSource.slice(0, 10);
      // }

      this.allOnlineClass = this.dataSource;
      // this.allOnlineClass = this.dataSource.slice(event.first, (event.first + event.rows));
      this.totalRecords = this.dataSource.length;
    }, error => {
      this.spinnerService.hide();
    });
    // this.loading = false;
  }

  createOnlineClass() {
    this.modalService.open(this.reportInvalidQuestion, {
      size: 'lg', windowClass: 'confirm-dialog-window',
      centered: true, backdrop: 'static', keyboard: false
    });
  }

  cancelModal() {
    this.modalService.dismissAll();
    this.onlineClassForm.reset();
  }

  topicFormValid() {
    return this.onlineClassForm.valid;
  }

  saveTopic() {
    this.spinnerService.show();
    if (this.isAddMode) {
      const topicsParam: IAdminTableParams = {
        Table: 'URLLinks',
        FilterFieldName: 'Link',
        FilterFieldValue: this.onlineClassForm.get('Link').value,
        Data: [
          {
            FieldName: 'BatchId',
            FieldValue: this.onlineClassForm.get('BatchId').value
          },
          {
            FieldName: 'Link',
            FieldValue: this.onlineClassForm.get('Link').value
          },
          {
            FieldName: 'SubTopicId',
            FieldValue: this.onlineClassForm.get('SubTopicId').value
          },
          {
            FieldName: 'StartDtTime',
            FieldValue: this.datePipe.transform(this.onlineClassForm.get('StartDtTime').value, 'MM/dd/yy h:mm:ss a')
          },
          {
            FieldName: 'EndDtTime',
            FieldValue: this.datePipe.transform(this.onlineClassForm.get('EndDtTime').value, 'MM/dd/yy h:mm:ss a')
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
        this.refreshData();
        this.loadOnlieClassData(this.lazyLoadEvent);
        this.onlineClassForm.reset();
        this.spinnerService.hide();
        this.modalService.dismissAll();
      }, (e) => {
        this.spinnerService.hide();
        this.messageService.add({ severity: 'eror', summary: 'Error in while adding...', detail: '' });
        this.modalService.dismissAll();
      });
    } else {
      const topicsParam: IAdminTableParams = {
        Table: 'URLLinks',
        Data: [
          {
            FieldName: 'Id',
            FieldValue: this.selectedOnlineClass.Id
          },
          {
            FieldName: 'BatchId',
            FieldValue: this.onlineClassForm.get('BatchId').value
          },
          {
            FieldName: 'SubTopicId',
            FieldValue: this.onlineClassForm.get('SubTopicId').value
          },
          {
            FieldName: 'StartDtTime',
            FieldValue: this.datePipe.transform(this.onlineClassForm.get('StartDtTime').value, 'MM/dd/yy h:mm:ss a')
          },
          {
            FieldName: 'EndDtTime',
            FieldValue: this.datePipe.transform(this.onlineClassForm.get('EndDtTime').value, 'MM/dd/yy h:mm:ss a')
          },
          {
            FieldName: 'Link',
            FieldValue: this.onlineClassForm.get('Link').value
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
      this.adminCommonEndpointsService.updateRecord(topicsParam).toPromise().then((result) => {
        this.messageService.add({ severity: 'success', summary: result['message'], detail: '' });
        this.onlineClassForm.reset();
        this.spinnerService.hide();
        this.refreshData();
        this.loadOnlieClassData(this.lazyLoadEvent);
        this.modalService.dismissAll();
      }, (e) => {
        this.spinnerService.hide();
        // this.messageService.add({ severity: 'error', summary: 'Error in while updating...', detail: '' });
        this.modalService.dismissAll();
      });
    }
  }

  deleteOnlineClass(url) {
    this.spinnerService.show();
    const removeRecord = {
      Table: 'URLLinks',
      //PKey: url.BatchId
      PKey: url.Id
    };
    this.adminCommonEndpointsService.deleteRecord(removeRecord).subscribe(result => {
      this.messageService.add({ severity: 'success', summary: 'Successfully deleted.', detail: '' });
      this.refreshData();
      this.loadOnlieClassData(this.lazyLoadEvent);
      this.spinnerService.hide();
      this.modalService.dismissAll();
    }, (e) => {
      this.spinnerService.hide();
      // this.messageService.add({ severity: 'error', summary: 'Error in while updating...', detail: '' });
      this.modalService.dismissAll();
    });
  }

  viewOnlineClass(url) {
    this.spinnerService.show();
    const viewRecord = {
      Table: 'vw_Links',
      PKey: 'Id',
      PKeyFld: url.Id
    };
    this.adminCommonEndpointsService.getRecordById(viewRecord).subscribe(result => {
      this.selectedOnlineClass = result['message'][0];
      this.modalService.open(this.displayTopics, {
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
    this.selectedOnlineClass = topic;
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
      a.download = 'OnlineClass.csv';
      a.click();
      window.URL.revokeObjectURL(url);
      a.remove();
    }
  }

  editOnlineClass(selectedOnlineClass) {
    this.selectedOnlineClass = selectedOnlineClass;
    console.log(this.selectedOnlineClass);
    const sDate = new Date(selectedOnlineClass.StartDtTime).toISOString();
    const eDate = new Date(selectedOnlineClass.EndDtTime).toISOString();
    this.onlineClassForm.patchValue({
      BatchId: selectedOnlineClass.BatchId,
      SubTopicId: selectedOnlineClass.SubTopicId,
      StartDtTime: moment(selectedOnlineClass.StartDtTime).toDate(),
      EndDtTime: moment(selectedOnlineClass.EndDtTime).toDate(),
      Link: selectedOnlineClass.Link
    });
    this.isAddMode = false;
    this.modalService.open(this.reportInvalidQuestion, {
      size: 'lg', windowClass: 'confirm-dialog-window',
      centered: true, backdrop: 'static', keyboard: false
    });
  }
}
