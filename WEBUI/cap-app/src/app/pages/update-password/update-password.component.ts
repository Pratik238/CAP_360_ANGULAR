import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { rolesEnum } from 'src/app/models/Enum/roles';
import { User } from 'src/app/models/interfaces';
import { AdminCommonEndpointsService } from 'src/app/services/admin-common-endpoints.service';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { CustomvalidationService } from 'src/app/services/Customvalidation.service';

@Component({
  selector: 'app-update-password',
  templateUrl: './update-password.component.html',
  styleUrls: ['./update-password.component.scss']
})
export class UpdatePasswordComponent implements OnInit {


  updatePasswordForm: FormGroup;
  batches: any[] = [];
  user: User;

  constructor(private fb: FormBuilder,
    private adminCommonEndpointsService: AdminCommonEndpointsService,
    private authenticationService: AuthenticationService,
    private customValidator: CustomvalidationService,
    private messageService: MessageService) { }

  ngOnInit() {
    this.updatePasswordForm = this.fb.group({
      OldPassword: new FormControl('', Validators.required),
      NewPassword: new FormControl('', Validators.compose([Validators.required])),
      confirmPassword: new FormControl('', Validators.required),
    },
      {
        validator: this.customValidator.MatchPassword('NewPassword', 'confirmPassword'),
      });
    this.user = this.authenticationService.userValue;
  }

  get f() { return this.updatePasswordForm.controls; }

  formValid() {
    return this.updatePasswordForm.valid;
  }

  updateProfile() {
    if (this.user.Usertype === rolesEnum.User) {
      this.adminCommonEndpointsService.studentChangePassword(this.updatePasswordForm.value.OldPassword, this.updatePasswordForm.value.NewPassword, this.user.UserName).subscribe(res => {
        this.messageService.add({ severity: 'success', summary: 'Updated successfully...', detail: '' });
        this.updatePasswordForm.reset();
      }, (e) => {
        this.updatePasswordForm.reset();
        // if (e.text) {
        //   this.messageService.add({ severity: 'success', summary: e.text, detail: '' });
        // }
        // if (e.Error) {
        //   this.messageService.add({ severity: 'error', summary: e.Error[0], detail: '' });
        // }
      });
    } else {
      this.adminCommonEndpointsService.updateUserPassword(this.updatePasswordForm.value.OldPassword, this.updatePasswordForm.value.NewPassword, this.user.UserName).toPromise().then(res => {
        this.messageService.add({ severity: 'success', summary: 'Password changed succefully...', detail: '' });
        this.updatePasswordForm.reset();
      },
        (e) => {
          this.updatePasswordForm.reset();
          // if (e.text) {
          //   this.messageService.add({ severity: 'success', summary: e.text, detail: '' });
          // }
          // if (e.Error) {
          //   this.messageService.add({ severity: 'error', summary: e.Error[0], detail: '' });
          // }
        });
    }
  }

}
