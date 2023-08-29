import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { ToasterService } from 'src/app/services/toaster.service';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { StudentCommonEndpointsService } from '../services/student-common-endpoints.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {

  forgotPassowrdForm: FormGroup;
  validUserForm: FormGroup;
  updateNewPasswordForm: FormGroup;
  isValidUserForm: boolean = false;
  isHideForm: boolean = false;
  isUpdateNewPassword: boolean = false;

  constructor(private fb: FormBuilder,
    private router: Router,
    private messageService: MessageService,
    private toasterService: ToasterService,
    private spinnerService: NgxSpinnerService,
    private studentCommonEndpointsService: StudentCommonEndpointsService) {
  }

  ngOnInit() {
    this.forgotPassowrdForm = this.fb.group({
      emailId: new FormControl('', [Validators.required, Validators.email])
    });

    this.validUserForm = this.fb.group({
      privateKey: new FormControl('', [Validators.required]),
      verifiedEmailId: new FormControl('', [Validators.required, Validators.email])
    });
    // Update new password form
    this.updateNewPasswordForm = this.fb.group({
      NewPassword: new FormControl('', Validators.required)
    });
  }

  onSubmit() {
    this.spinnerService.show();
    this.isValidUserForm = true;
    const enteredEmailId = this.forgotPassowrdForm.get('emailId').value;
    this.validUserForm.get('verifiedEmailId').patchValue(enteredEmailId);
    this.studentCommonEndpointsService.sendEmailForResetPassword(enteredEmailId).subscribe(res => {
      this.forgotPassowrdForm.reset();
    }, (e) => {
      if (e.text) {
        this.messageService.add({ severity: 'success', summary: e.text, detail: '' });
      }
      if (e.Error) {
        this.messageService.add({ severity: 'error', summary: e.Error[0], detail: '' });
      }
      this.spinnerService.hide();
    });
  }

  formValid() {
    return this.validUserForm.valid;
  }

  updatePasswordFormValid() {
    return this.updateNewPasswordForm.valid;
  }

  mailFormValid() {
    return this.forgotPassowrdForm.valid;
  }

  submitSecureKey() {
    this.spinnerService.show();
    const emailId = this.validUserForm.get('verifiedEmailId').value;
    const verficationCode = this.validUserForm.get('privateKey').value;
    this.studentCommonEndpointsService.getVerificationcode(emailId, verficationCode).subscribe(res => {
      if (res) {
        this.messageService.add({ severity: 'success', summary: 'Verified successfully...!', detail: '' });
        this.isUpdateNewPassword = true;
        this.isHideForm = false;
        this.isValidUserForm = false;
        this.validUserForm.reset();
      } else {
        this.messageService.add({ severity: 'error', summary: 'entered in correct secure key ...!', detail: '' });
      }
    });
    this.spinnerService.hide();
  }

  updateNewPassword() {
    this.spinnerService.show();
    this.studentCommonEndpointsService.updatePassword(this.updateNewPasswordForm.value.NewPassword, this.forgotPassowrdForm.get('emailId').value).subscribe(res => {
      this.spinnerService.hide();
    }, (e) => {
      // if (e.text) {
      //   this.messageService.add({ severity: 'success', summary: e.text, detail: '' });
      // }
      // if (e.Error) {
      //   this.messageService.add({ severity: 'error', summary: e.Error[0], detail: '' });
      // }
      this.spinnerService.hide();
    });
    this.isUpdateNewPassword = false;
    this.router.navigate(['/login']);
  }

}
