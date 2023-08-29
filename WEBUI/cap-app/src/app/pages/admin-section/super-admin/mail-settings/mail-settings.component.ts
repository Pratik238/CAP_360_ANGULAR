import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { LazyLoadEvent, MessageService } from 'primeng/api';
import { User } from 'src/app/models/interfaces';
import { IAdminTableParams } from 'src/app/models/interfaces/admin-table';
import { AdminCommonEndpointsService } from 'src/app/services/admin-common-endpoints.service';
import { AuthenticationService } from 'src/app/services/authentication.service';

@Component({
  selector: 'app-mail-settings',
  templateUrl: './mail-settings.component.html',
  styleUrls: ['./mail-settings.component.scss']
})
export class MailSettingsComponent implements OnInit {


  @ViewChild('addEditmailConfigurationForm') addEditmailConfigurationForm: ElementRef;
  @ViewChild('displayTopics') displayTopics: ElementRef;
  @ViewChild('displayWarningMessage') displayWarningMessage: ElementRef;

  mailConfigurationForm: FormGroup;
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
  totalRecords: number;
  mailConfiguration: any;
  isAddMode = true;
  user: User;

  constructor(
    private adminCommonEndpointsService: AdminCommonEndpointsService,
    private fb: FormBuilder,
    private authenticationService: AuthenticationService,
    private spinnerService: NgxSpinnerService,
    private modalService: NgbModal,
    private messageService: MessageService) { }

  ngOnInit() {
    this.loadApiData();
    this.mailConfigurationForm = this.fb.group({
      Subject: new FormControl('', Validators.required),
      Password: new FormControl('', Validators.required),
      Dear: new FormControl('', Validators.required),
      Body: new FormControl('', Validators.required),
      Regards: new FormControl('', Validators.required),
      RegardsName: new FormControl('', Validators.required)
    });

  }

  loadApiData() {
    this.spinnerService.show();
    this.adminCommonEndpointsService.getCommonLists('MailSettings', 'Order by', 'Id', 'ASC', true).subscribe(result => {
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
    setTimeout(() => {
      if (this.allTopicsArray) {
        this.allTopicsArray = this.allTopicsArray.slice(event.first, (event.first + event.rows));
        this.spinnerService.hide();
      }
    }, 1000);
  }

  addNewSubject() {
    this.isAddMode = true;
    this.modalService.open(this.addEditmailConfigurationForm, {
      size: 'lg', windowClass: 'confirm-dialog-window',
      centered: true, backdrop: 'static', keyboard: false
    });
  }

  cancelSubjects() {
    this.mailConfigurationForm.reset();
    this.modalService.dismissAll();
  }

  topicFormValid() {
    return this.mailConfigurationForm.valid;
  }

  saveTopic() {
    this.spinnerService.show();
    this.modalService.dismissAll();
    if (this.isAddMode) {
      const topicObj = {
        SubjectName: this.mailConfigurationForm.get('SubjectName').value,
      };

      const topicsParam: IAdminTableParams = {
        Table: 'MailSettings',
        FilterFieldName: 'Subject',
        FilterFieldValue: this.mailConfigurationForm.get('Subject').value,
        Data: [
          {
            FieldName: 'Subject',
            FieldValue: this.mailConfigurationForm.get('Subject').value
          },
          {
            FieldName: 'MailId',
            FieldValue: this.mailConfigurationForm.get('MailId').value
          },
          {
            FieldName: 'Password',
            FieldValue: this.mailConfigurationForm.get('Password').value
          },
          {
            FieldName: 'Dear',
            FieldValue: this.mailConfigurationForm.get('Dear').value
          },
          {
            FieldName: 'Body',
            FieldValue: this.mailConfigurationForm.get('Body').value
          },
          {
            FieldName: 'Regards',
            FieldValue: this.mailConfigurationForm.get('Regards').value
          },
          {
            FieldName: 'RegardsName',
            FieldValue: this.mailConfigurationForm.get('RegardsName').value
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
        this.mailConfigurationForm.reset();
      }, (e) => {
        // this.messageService.add({ severity: 'error', summary: 'Error in while adding...', detail: '' });
        this.spinnerService.hide();
      });
    } else {
      const topicObj = {
        SubjectName: this.mailConfigurationForm.get('SubjectName').value,
      };

      const topicsParam: IAdminTableParams = {
        Table: 'MailSettings',
        Data: [
          {
            FieldName: 'Id',
            FieldValue: this.mailConfiguration.Id
          },
          {
            FieldName: 'Subject',
            FieldValue: this.mailConfigurationForm.get('Subject').value
          },
          {
            FieldName: 'MailId',
            FieldValue: this.mailConfigurationForm.get('MailId').value
          },
          {
            FieldName: 'Password',
            FieldValue: this.mailConfigurationForm.get('Password').value
          },
          {
            FieldName: 'Dear',
            FieldValue: this.mailConfigurationForm.get('Dear').value
          },
          {
            FieldName: 'Body',
            FieldValue: this.mailConfigurationForm.get('Body').value
          },
          {
            FieldName: 'Regards',
            FieldValue: this.mailConfigurationForm.get('Regards').value
          },
          {
            FieldName: 'RegardsName',
            FieldValue: this.mailConfigurationForm.get('RegardsName').value
          },
          {
            FieldName: 'Port',
            FieldValue: this.mailConfiguration.Port
          },
          {
            FieldName: 'Createdby',
            FieldValue: this.mailConfiguration.Createdby
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
        this.mailConfigurationForm.reset();
        this.modalService.dismissAll();
      }, (e) => {
        // this.messageService.add({ severity: 'error', summary: 'Error in while updating...', detail: '' });
        this.spinnerService.hide();
      });
    }
  }

  editMailSetting(mailSetting) {
    this.mailConfiguration = mailSetting;
    this.mailConfigurationForm.patchValue({
      Subject: mailSetting.Subject,
      MailId: mailSetting.MailId,
      Password: mailSetting.Password,
      Dear: mailSetting.Dear,
      Body: mailSetting.Body,
      Regards: mailSetting.Regards,
      Port: mailSetting.Port,
      RegardsName: mailSetting.RegardsName,
    });
    this.isAddMode = false;
    this.modalService.open(this.addEditmailConfigurationForm, {
      size: 'md', windowClass: 'confirm-dialog-window',
      centered: true, backdrop: 'static', keyboard: false
    });
  }

  deleteMailSetting(subject) {
    this.spinnerService.show();
    const removeRecord = {
      Table: 'MailSettings',
      PKey: subject.Id
    };
    this.adminCommonEndpointsService.deleteRecord(removeRecord).subscribe(result => {
      this.messageService.add({ severity: 'success', summary: 'Mail setting removed successfully', detail: '' });
      this.spinnerService.hide();
      this.modalService.dismissAll();
      this.loadApiData();
    }, (e) => {
      // this.messageService.add({ severity: 'error', summary: 'Error in while removing...', detail: '' });
      this.spinnerService.hide();
      this.modalService.dismissAll();
    });
  }

  viewMailSetting(mailConfiguration) {
    this.mailConfiguration = mailConfiguration;
    this.modalService.open(this.displayTopics, {
      size: 'lg', windowClass: 'confirm-dialog-window',
      centered: true, backdrop: 'static', keyboard: false
    });
  }

  removeMailSetting(mailConfiguration) {
    this.mailConfiguration = mailConfiguration;
    this.modalService.open(this.displayWarningMessage, {
      size: 'md', windowClass: 'confirm-dialog-window',
      centered: true, backdrop: 'static', keyboard: false
    });
  }

  allFormsValid() {
    return this.mailConfigurationForm.valid;
  }


}
