import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { NgxSpinnerService } from 'ngx-spinner';
import { MessageService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { User } from 'src/app/models/interfaces';
import { IAdminTableParams } from 'src/app/models/interfaces/admin-table';
import { AdminCommonEndpointsService } from 'src/app/services/admin-common-endpoints.service';
import { AuthenticationService } from 'src/app/services/authentication.service';



@Component({
  selector: 'app-contactus',
  templateUrl: 'contactus.component.html',
  styleUrls: ['contactus.component.css'],
  providers: [DialogService]
})
export class ContactusComponent implements OnInit {

  isMobileResolution = false;

  contactForm: FormGroup;
  submitted = false;
  isShowContactForm = true;

  senndingEmails: any[] = [
    {
      id: 'practice@cap.center',
      value: 'PRACTICE@CAP.CENTER'
    },
    {
      id: 'support@cap.center',
      value: 'SUPPORT@CAP.CENTER'
    }
  ];

  user: User;

  constructor(private messageService: MessageService,
    private adminCommonEndpointsService: AdminCommonEndpointsService,
    private spinnerService: NgxSpinnerService,
    private authenticationService: AuthenticationService,
    private formBuilder: FormBuilder) {
    this.user = this.authenticationService.userValue;
  }

  ngOnInit() {
    this.contactForm = this.formBuilder.group({
      EmailTo: [null, Validators.required],
      Name: ['', Validators.required],
      // EmailId: ['', [Validators.required, Validators.email]],
      Phone: ['', [Validators.required, Validators.maxLength(10)]],
      Subject: [''],
      Message: ['']
    });

    this.spinnerService.show();
    setTimeout(() => {
      this.spinnerService.hide();
    }, 1000);
  }

  // convenience getter for easy access to form fields
  get f() { return this.contactForm.controls; }

  saveContact() {
    this.submitted = true;
    // stop here if form is invalid
    if (this.contactForm.invalid) {
      return;
    }

    /* const contactData: IAdminTableParams = {
      Table: 'Contactus',
      FilterFieldName: 'Phone',
      FilterFieldValue: this.contactForm.get('Phone').value,
      Data: [
        {
          FieldName: 'EmailTo',
          FieldValue: this.contactForm.get('EmailTo').value
        },
        {
          FieldName: 'Name',
          FieldValue: this.contactForm.get('Name').value
        },
        {
          FieldName: 'EmailId',
          FieldValue: this.user.UserName
        },
        {
          FieldName: 'Phone',
          FieldValue: this.contactForm.get('Phone').value
        },
        {
          FieldName: 'Subject',
          FieldValue: this.contactForm.get('Subject').value
        },
        {
          FieldName: 'Message',
          FieldValue: this.contactForm.get('Message').value
        },
        {
          FieldName: 'BatchId',
          FieldValue: this.user.BatchIds
        }       
      ]
    }; */
    const studentContactUsReqObj: any = {
      Name: this.contactForm.get('Name').value,
      Phone: this.contactForm.get('Phone').value,
      EmailId: this.user.UserName,
      EmailTo: this.contactForm.get('EmailTo').value,
      Subject: this.contactForm.get('Subject').value,
      Message: this.contactForm.get('Message').value,
      BatchId: this.user.BatchIds
    }
    this.adminCommonEndpointsService.addContactInfo(studentContactUsReqObj).toPromise().then((result) => {
      this.contactForm.reset();
      this.spinnerService.hide();
      this.messageService.add({ severity: 'success', summary: 'Thank You for contacting Us - we will get back to you...!', detail: '' });
    }, (e) => {
      // this.messageService.add({ severity: 'error', summary: 'Error in while mail sending...', detail: '' });
      this.contactForm.reset();
    });

  }

  allFormsValid() {
    return this.contactForm.valid;
  }

  backToContact() {
    this.isShowContactForm = true;
  }
}
