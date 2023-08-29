import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators, FormArray, FormGroup } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { MessageService } from 'primeng/api';
import { rolesEnum } from 'src/app/models/Enum/roles';
import { User } from 'src/app/models/interfaces';
import { IViewRecord } from 'src/app/models/interfaces/admin-table';
import { AdminCommonEndpointsService } from 'src/app/services/admin-common-endpoints.service';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { StudentCommonEndpointsService } from 'src/app/services/student-common-endpoints.service';
import { ToasterService } from 'src/app/services/toaster.service';

@Component({
  selector: 'app-update-profile',
  templateUrl: './update-profile.component.html',
  styleUrls: ['./update-profile.component.scss']
})
export class UpdateProfileComponent implements OnInit {

  updateProfilelForm: FormGroup;
  batches: any[] = [];
  isShowProfileDetails: boolean = true;
  profileData: any;

  user: User;

  constructor(private fb: FormBuilder,
              private adminCommonEndpointsService: AdminCommonEndpointsService,
              private studentCommonEndpointsService: StudentCommonEndpointsService,
              private authenticationService: AuthenticationService,
              private spinnerService: NgxSpinnerService,
              private messageService: MessageService) { }

  ngOnInit() {
    this.user  = this.authenticationService.userValue;
    this.loadCurrentUserData();
    this.updateProfilelForm = this.fb.group({
      FirstName: new FormControl('', Validators.required),
      LastName: new FormControl('', Validators.required),
      EmailId: new FormControl('', Validators.required),
      PhoneNumber: new FormControl('', Validators.required),
    });
  }

  loadCurrentUserData() {
    if (this.user.Usertype === rolesEnum.User) {
      const userData: IViewRecord = {
        Table: 'StudentAdmission',
        PKey: 'StudentId',
        PKeyFld: this.user.UserId.toString()
      }
      this.adminCommonEndpointsService.getRecordById(userData).subscribe(res => {
        this.profileData = res['message'][0];
      });
    } else {
      const userData: IViewRecord = {
        Table: 'Users',
        PKey: 'UserId',
        PKeyFld: this.user.UserId.toString()
      }
      this.adminCommonEndpointsService.getRecordById(userData).subscribe(res => {
        this.profileData = res['message'][0];
      });
    }
  }

  allFormsValid() {
    return this.updateProfilelForm.valid;
  }

  updateProfile() {
    const studentObj = {
      Oldemail: this.user.UserName,
      EmailId: this.updateProfilelForm.value.EmailId,
      firstname: this.updateProfilelForm.value.FirstName,
      lastName: this.updateProfilelForm.value.LastName,
      phonenumber: JSON.parse(JSON.stringify(this.updateProfilelForm.value.PhoneNumber))
    };
    if (this.user.Usertype === rolesEnum.User) {
      this.studentCommonEndpointsService.updateStudentProfile(studentObj.Oldemail, studentObj.EmailId, studentObj.firstname, studentObj.lastName, studentObj.phonenumber ).subscribe(res => {
        this.messageService.add({severity: 'success', summary: 'Updated successfully...', detail: ''});
        this.isShowProfileDetails = true;
        this.updateProfilelForm.reset();
        this.spinnerService.hide();
      }, (e) => {
        this.updateProfilelForm.reset();
        this.loadCurrentUserData();
        if (e.text) {
          this.messageService.add({ severity: 'success', summary: e.text, detail: '' });
        }
        if (e.Error) {
          this.messageService.add({ severity: 'error', summary: e.Error[0], detail: '' });
        }
        this.isShowProfileDetails = true;
        this.spinnerService.hide();
      });
    } else {
      this.studentCommonEndpointsService.updateUserProfile(studentObj.Oldemail, studentObj.EmailId, studentObj.firstname, studentObj.lastName, studentObj.phonenumber ).subscribe(res => {
        this.messageService.add({severity: 'success', summary: 'Updated successfully...', detail: ''});
        this.isShowProfileDetails = true;
        this.updateProfilelForm.reset();
        this.spinnerService.hide();
      }, (e) => {
        this.loadCurrentUserData();
        this.updateProfilelForm.reset();
        if (e.text) {
          this.messageService.add({ severity: 'success', summary: e.text, detail: '' });
        }
        if (e.Error) {
          this.messageService.add({ severity: 'error', summary: e.Error[0], detail: '' });
        }
        this.isShowProfileDetails = true;
        this.spinnerService.hide();
      });
    }
  }

  editProfile() {
    this.isShowProfileDetails = false;
    this.updateProfilelForm.patchValue({
      FirstName: this.profileData.FirstName ? this.profileData.FirstName : this.profileData.StudentFirstName,
      LastName: this.profileData.LastName ? this.profileData.LastName : this.profileData.StudentLastName,
      EmailId: this.profileData.EmailId,
      PhoneNumber: this.profileData.PhoneNumber ? this.profileData.PhoneNumber : this.profileData.Contactno
    });
  }

  cancelProfile() {
    this.updateProfilelForm.reset();
    this.isShowProfileDetails = true;
  }

}
