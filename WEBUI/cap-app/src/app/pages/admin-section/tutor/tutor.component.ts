import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
// import { stat } from 'fs';
import { NgxSpinnerService } from 'ngx-spinner';
import { LazyLoadEvent, MessageService } from 'primeng/api';
import { rolesEnum } from 'src/app/models/Enum/roles';
import { User } from 'src/app/models/interfaces';
import { AdminCommonEndpointsService } from 'src/app/services/admin-common-endpoints.service';
import { AuthenticationService } from 'src/app/services/authentication.service';

@Component({
  selector: 'app-tutor',
  templateUrl: './tutor.component.html',
  styleUrls: ['./tutor.component.scss']
})
export class TutorComponent implements OnInit {

  @ViewChild('addNewTutorForm') addNewTutorForm: ElementRef;
  @ViewChild('displayTutor') displayTutor: ElementRef;
  @ViewChild('displayWarningMessage') displayWarningMessage: ElementRef;

  selectedProducts: [];

  value: Date;
  p = 1;

  tutorForm: FormGroup;
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


  allTutors: any[] = [];
  totalRecords: number;
  dataSource: any[] = [];
  lazyLoadEvent: any;
  user: User;
  isAddMode = true;
  tutorData: any;
  isDislaySuperAdmin: boolean = false;
  centerAdmin: any[] = [];
  centerAdminCopy: any[] = [];
  currentstatus = 'Active';

  constructor(
    private spinnerService: NgxSpinnerService,
    private adminCommonEndpointsService: AdminCommonEndpointsService,
    private fb: FormBuilder,
    private authenticationService: AuthenticationService,
    private modalService: NgbModal,
    private messageService: MessageService) { }

  ngOnInit() {
    this.user = this.authenticationService.userValue;
    this.tutorForm = this.fb.group({
      FirstName: new FormControl('', Validators.required),
      LastName: new FormControl('', Validators.required),
      PhoneNumber: new FormControl('', Validators.compose([Validators.required, Validators.maxLength(10)])),
      EmailId: new FormControl('', [Validators.required, Validators.email]),
      Password: new FormControl('', Validators.required),
      CenteradminId: new FormControl(null),
      IsActive: new FormControl(1, Validators.required),
    });

    this.loadCenterAdminData();
    this.loadTutorData(this.lazyLoadEvent);

  }

  loadCenterAdminData() {
    var isSuperAdmin = 0;
    if (this.user.Usertype === rolesEnum.SuperAdmin) {
      this.isDislaySuperAdmin = true;
      isSuperAdmin = 1;
      // this.spinnerService.show();
      this.tutorForm.get('CenteradminId').setValidators(Validators.required);
      this.adminCommonEndpointsService.getUsersList('4', this.user.UserId, isSuperAdmin).subscribe(result => {
        this.centerAdmin = result;
        this.centerAdminCopy = result;
        // this.spinnerService.hide();
      }, error => {
        // this.spinnerService.hide();
      });
    } else {
      isSuperAdmin = 0;
      this.isDislaySuperAdmin = false;
      this.tutorForm.get('CenteradminId').setValidators(null);
    }
  }

  loadTutorData(event: LazyLoadEvent, status = 'Active') {
    this.currentstatus = status;
    this.spinnerService.show();
    this.lazyLoadEvent = event;
    var isSuperAdmin = 0;
    if (this.user.Usertype === rolesEnum.SuperAdmin) {
      isSuperAdmin = 1;
    } else {
      isSuperAdmin = 0;
    }
    this.adminCommonEndpointsService.getUsersList('3', this.user.UserId, isSuperAdmin, this.currentstatus).subscribe(result => {
      this.dataSource = result;
      // if (event && event.first && event.rows) {
      //   this.allTutors = this.dataSource.slice(event.first, (event.first + event.rows));
      // } else {
      //   this.allTutors = this.dataSource.slice(0, 10);
      // }

      this.allTutors = this.dataSource;
      // this.allTutors = this.dataSource.slice(event.first, (event.first + event.rows));
      this.totalRecords = this.dataSource.length;
      this.spinnerService.hide();
    }, error => {
      this.spinnerService.hide();
    });
  }

  createTutor() {
    this.isAddMode = true;
    this.modalService.open(this.addNewTutorForm, {
      size: 'lg', windowClass: 'confirm-dialog-window',
      centered: true, backdrop: 'static', keyboard: false
    });
    this.loadCenterAdminData();
    this.tutorForm.patchValue({
      IsActive: 1
    });
  }

  cancelTutor() {
    this.tutorForm.reset();
    this.modalService.dismissAll();
  }

  topicFormValid() {
    return this.tutorForm.valid;
  }

  allFormValid() {
    return this.tutorForm.valid;
  }

  closeModal() {
    this.tutorForm.reset();
  }

  saveTutor() {
    this.modalService.dismissAll();
    var superAdmin = 0;
    // if (this.user.Usertype === rolesEnum.SuperAdmin) {
    //   superAdmin = this.tutorForm.get('CenteradminId').value;
    // } else {
    //   superAdmin = this.user.UserId;
    // }
    if (this.isAddMode) {
      const tutorObj = {
        FirstName: this.tutorForm.get('FirstName').value,
        LastName: this.tutorForm.get('LastName').value,
        PhoneNumber: this.tutorForm.get('PhoneNumber').value,
        EmailId: this.tutorForm.get('EmailId').value,
        Password: this.tutorForm.get('Password').value,
        UserType: rolesEnum.Tutor,
        //CenterAdminId: superAdmin,
        CenterAdminId: this.tutorForm.get('CenteradminId').value,
        IsActive: this.tutorForm.get('IsActive').value,
        Createdby: this.user.Name,
        UpdatedBy: this.user.Name
      };

      this.spinnerService.show();
      this.adminCommonEndpointsService.addUser(tutorObj).toPromise().then((result) => {
        this.spinnerService.hide();
        if (result.IsSuccessStatusCode) {
          this.messageService.add({ severity: 'success', summary: 'Tutor added successfully', detail: '' });
        } else {
          this.messageService.add({ severity: 'warn', summary: 'Tutor already exists', detail: '' });
        }
        this.tutorForm.reset();
        this.modalService.dismissAll();
        this.loadTutorData(this.lazyLoadEvent);
      }, (e) => {
        // this.messageService.add({ severity: 'error', summary: 'Error in while adding...', detail: '' });
        this.spinnerService.hide();
        this.tutorForm.reset();
        this.modalService.dismissAll();
      });
    } else {
      const tutorObj = {
        UserId: this.tutorData.UserId,
        FirstName: this.tutorForm.get('FirstName').value,
        LastName: this.tutorForm.get('LastName').value,
        PhoneNumber: this.tutorForm.get('PhoneNumber').value,
        EmailId: this.tutorForm.get('EmailId').value,
        Password: this.tutorForm.get('Password').value,
        UserType: rolesEnum.Tutor,
        IsActive: this.tutorForm.get('IsActive').value,
        //CenterAdminId: this.user.UserId,
        CenterAdminId: this.tutorForm.get('CenteradminId').value,
        Createdby: this.user.Name,
        UpdatedBy: this.user.Name
      };
      this.spinnerService.show();
      this.adminCommonEndpointsService.updateUser(tutorObj).toPromise().then((result) => {
        this.spinnerService.hide();
        this.messageService.add({ severity: 'success', summary: 'Tutor updated successfully', detail: '' });
        this.tutorForm.reset();
        this.loadTutorData(this.lazyLoadEvent);
        this.modalService.dismissAll();
      }, (e) => {
        this.tutorForm.reset();
        // this.messageService.add({ severity: 'error', summary: 'Error in while updating...', detail: '' });
        this.spinnerService.hide();
        this.modalService.dismissAll();
      });
    }
  }

  editTutor(tutor) {
    this.tutorData = tutor;
    this.tutorForm.patchValue({
      FirstName: tutor.FirstName,
      LastName: tutor.LastName,
      PhoneNumber: tutor.PhoneNumber,
      EmailId: tutor.EmailId,
      Password: tutor.Password,
      CenteradminId: tutor.CenterAdminId,
      UserType: tutor.UserType,
      IsActive: tutor.IsActive ? 1 : 0,
    });
    // filtering only added center admin
    // if (this.centerAdminCopy.length > 0) {
    //   this.centerAdmin = this.centerAdminCopy.filter(x => x.UserId === tutor.CenterAdminId);
    // }
    this.isAddMode = false;
    this.modalService.open(this.addNewTutorForm, {
      size: 'lg', windowClass: 'confirm-dialog-window',
      centered: true, backdrop: 'static', keyboard: false
    });
  }

  deleteTutor(tutor) {
    this.spinnerService.show();
    this.adminCommonEndpointsService.removeItem(tutor.UserId).subscribe(result => {
      this.spinnerService.hide();
      this.loadTutorData(this.lazyLoadEvent);
      this.modalService.dismissAll();
    }, (e) => {
      this.loadTutorData(this.lazyLoadEvent);
      this.spinnerService.hide();
      this.modalService.dismissAll();
      if (e.text) {
        this.messageService.add({ severity: 'success', summary: e.text, detail: '' });
      }
      // if (e.error) {
      //   this.messageService.add({severity: 'error', summary: 'Error in while deleting...', detail: ''});
      // }
      this.modalService.dismissAll();
    });
  }

  viewTutor(tutorData) {
    this.tutorData = tutorData;
    this.modalService.open(this.displayTutor, {
      size: 'lg', windowClass: 'confirm-dialog-window',
      centered: false, backdrop: 'static', keyboard: false
    });
  }

  removeTutor(tutorData) {
    this.tutorData = tutorData;
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
      a.download = 'TutorReport.csv';
      a.click();
      window.URL.revokeObjectURL(url);
      a.remove();
    }
  }

}
