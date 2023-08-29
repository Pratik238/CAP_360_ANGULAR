import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AdminCommonEndpointsService } from 'src/app/services/admin-common-endpoints.service';
import { IAdminTableParams } from 'src/app/models/interfaces/admin-table';
import { NgxSpinnerService } from 'ngx-spinner';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { User } from 'src/app/models/interfaces';
import { LazyLoadEvent, MessageService } from 'primeng/api';
// import { stat } from 'fs';

@Component({
  selector: 'app-subjects',
  templateUrl: './subjects.component.html',
  styleUrls: ['./subjects.component.scss']
})
export class SubjectsComponent implements OnInit {

  @ViewChild('addEditSubjectForm') addEditSubjectForm: ElementRef;
  @ViewChild('displayTopics') displayTopics: ElementRef;
  @ViewChild('displayWarningMessage') displayWarningMessage: ElementRef;

  subjectForm: FormGroup;
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


  allTopicsArray: any[] = [];
  csvData: any[] = [];
  totalRecords: number;
  subject: any;
  isAddMode = true;
  user: User;
  lazyLoadEvent: any;
  currentstatus = 'true';

  constructor(
    private adminCommonEndpointsService: AdminCommonEndpointsService,
    private fb: FormBuilder,
    private authenticationService: AuthenticationService,
    private spinnerService: NgxSpinnerService,
    private modalService: NgbModal,
    private messageService: MessageService) { }

  ngOnInit() {
    this.loadApiData();
    this.subjectForm = this.fb.group({
      SubjectName: new FormControl('', Validators.required)
    });
    this.loadSubjects(this.lazyLoadEvent);

  }

  loadApiData(status = 'true') {
    this.spinnerService.show();
    this.currentstatus = status;
    this.adminCommonEndpointsService.getCommonLists('Subjects', 'Order by', 'SubjectId', 'ASC', this.currentstatus).subscribe(result => {
      this.csvData = result;
      this.allTopicsArray = result;
      this.totalRecords = this.allTopicsArray.length;
      this.spinnerService.hide();
    }, error => {
      this.spinnerService.hide();
    });
    this.user = this.authenticationService.userValue;
  }

  loadSubjects(event: LazyLoadEvent) {
    this.spinnerService.show();
    this.lazyLoadEvent = event;
    setTimeout(() => {
      if (this.allTopicsArray) {
        // if (event && event.first && event.rows) {
        //   this.allTopicsArray = this.allTopicsArray.slice(event.first, (event.first + event.rows));
        // } else {
        //   this.allTopicsArray = this.allTopicsArray.slice(0, 10);
        // }
        // this.allTopicsArray = this.allTopicsArray.slice(event.first, (event.first + event.rows));
        this.spinnerService.hide();
      }
    }, 1000);
  }

  addNewSubject() {
    this.isAddMode = true;
    this.modalService.open(this.addEditSubjectForm, {
      size: 'lg', windowClass: 'confirm-dialog-window',
      centered: true, backdrop: 'static', keyboard: false
    });
  }

  cancelSubjects() {
    this.subjectForm.reset();
    this.modalService.dismissAll();
  }

  topicFormValid() {
    return this.subjectForm.valid;
  }

  saveTopic() {
    this.spinnerService.show();
    this.modalService.dismissAll();
    if (this.isAddMode) {
      const topicObj = {
        SubjectName: this.subjectForm.get('SubjectName').value,
      };

      const topicsParam: IAdminTableParams = {
        Table: 'Subjects',
        FilterFieldName: 'SubjectName',
        FilterFieldValue: topicObj.SubjectName,
        Data: [
          {
            FieldName: 'SubjectName',
            FieldValue: topicObj.SubjectName
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
        this.loadApiData();
        this.spinnerService.hide();
        this.subjectForm.reset();
      }, (e) => {
        // this.messageService.add({ severity: 'error', summary: 'Error in while adding...', detail: '' });
        this.spinnerService.hide();
      });
    } else {
      const topicObj = {
        SubjectName: this.subjectForm.get('SubjectName').value,
      };

      const topicsParam: IAdminTableParams = {
        Table: 'Subjects',
        Data: [
          {
            FieldName: 'SubjectName',
            FieldValue: topicObj.SubjectName
          },
          {
            FieldName: 'SubjectId',
            FieldValue: this.subject.SubjectId
          },
          {
            FieldName: 'Createdby',
            FieldValue: this.subject.Createdby
          },
          {
            FieldName: 'UpdatedBy',
            FieldValue: this.user.Name
          }
        ]
      };
      this.adminCommonEndpointsService.updateRecord(topicsParam).toPromise().then((result) => {
        this.messageService.add({ severity: 'success', summary: result['message'], detail: '' });
        this.loadApiData();
        this.spinnerService.hide();
        this.subjectForm.reset();
        this.modalService.dismissAll();
      }, (e) => {
        // this.messageService.add({ severity: 'error', summary: 'Error in while updating...', detail: '' });
        this.spinnerService.hide();
      });
    }
  }

  editTopic(subject) {
    this.subject = subject;
    this.subjectForm.patchValue({
      SubjectName: subject.SubjectName
    });
    this.isAddMode = false;
    this.modalService.open(this.addEditSubjectForm, {
      size: 'md', windowClass: 'confirm-dialog-window',
      centered: true, backdrop: 'static', keyboard: false
    });
  }

  deleteTopic(subject) {
    this.spinnerService.show();
    const removeRecord = {
      Table: 'Subjects',
      PKey: subject.SubjectId
    };
    this.adminCommonEndpointsService.deleteRecord(removeRecord).subscribe(result => {
      this.messageService.add({ severity: 'success', summary: 'Subject removed successfully', detail: '' });
      this.spinnerService.hide();
      this.modalService.dismissAll();
      this.loadApiData();
    }, (e) => {
      // this.messageService.add({ severity: 'error', summary: 'Error in while removing...', detail: '' });
      this.spinnerService.hide();
      this.modalService.dismissAll();
    });
  }

  viewSubject(subject) {
    this.subject = subject;
    this.modalService.open(this.displayTopics, {
      size: 'lg', windowClass: 'confirm-dialog-window',
      centered: true, backdrop: 'static', keyboard: false
    });
  }

  removeTopic(subject) {
    this.subject = subject;
    this.modalService.open(this.displayWarningMessage, {
      size: 'md', windowClass: 'confirm-dialog-window',
      centered: true, backdrop: 'static', keyboard: false
    });
  }

  allFormsValid() {
    return this.subjectForm.valid;
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
      a.download = 'SubjectsReport.csv';
      a.click();
      window.URL.revokeObjectURL(url);
      a.remove();
    }
  }


}
