import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { LazyLoadEvent, MessageService } from 'primeng/api';
import { rolesEnum } from 'src/app/models/Enum/roles';
import { User } from 'src/app/models/interfaces/user';
import { AdminCommonEndpointsService } from 'src/app/services/admin-common-endpoints.service';
import { AuthenticationService } from 'src/app/services/authentication.service';

@Component({
  selector: 'app-admins',
  templateUrl: './admins.component.html',
  styleUrls: ['./admins.component.scss']
})
export class AdminsComponent implements OnInit {

  @ViewChild('addNewAdminForm') addNewAdminForm: ElementRef;
  @ViewChild('displayAdmins') displayAdmins: ElementRef;
  @ViewChild('displayWarningMessage') displayWarningMessage: ElementRef;

  selectedProducts: [];
  value: Date;

  adminForm: FormGroup;
  submitted = false;
  searchForm: FormGroup;

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

  allAdmins: any[] = [];
  dataSource: any[] = [];
  lazyLoadEvent: any;
  totalRecords: number;
  user: User;
  isAddMode = true;
  collectAdmin: any;
  currentstatus = 'InActive';

  constructor(private adminCommonEndpointsService: AdminCommonEndpointsService,
    private authenticationService: AuthenticationService,
    private spinnerService: NgxSpinnerService,
    private fb: FormBuilder,
    private modalService: NgbModal,
    private messageService: MessageService) { }

  ngOnInit() {
    this.user = this.authenticationService.userValue;
    this.adminForm = this.fb.group({
      FirstName: new FormControl('', Validators.required),
      LastName: new FormControl('', Validators.required),
      PhoneNumber: new FormControl('', Validators.compose([Validators.required, Validators.maxLength(10)])),
      EmailId: new FormControl('', [Validators.required, Validators.email]),
      Password: new FormControl('', Validators.required),
      IsActive: new FormControl(1, Validators.required),
    });

    this.searchForm = this.fb.group({
      FirstName: new FormControl(''),
      LastName: new FormControl(''),
      PhoneNumber: new FormControl(''),
      EmailId: new FormControl(''),
    });
    this.loadAdminData(this.lazyLoadEvent);

  }

  loadAdminData(event: LazyLoadEvent, isActive = "Active") {
    this.spinnerService.show();
    this.currentstatus = isActive;
    this.lazyLoadEvent = event;
    var isSuperAdmin = 0;
    if (this.user.Usertype === rolesEnum.SuperAdmin) {
      isSuperAdmin = 1;
    } else {
      isSuperAdmin = 0;
    }
    this.adminCommonEndpointsService.getUsersList('1', this.user.UserId, isSuperAdmin, this.currentstatus).subscribe(result => {

      this.spinnerService.hide();
      this.dataSource = result;
      // if (event && event.first && event.rows) {
      //   this.allAdmins = this.dataSource.slice(event.first, (event.first + event.rows));
      // } else {
      //   this.allAdmins = this.dataSource.slice(0, 10);
      // }

      this.allAdmins = result;
      this.totalRecords = this.dataSource.length;
    }, error => {
      this.spinnerService.hide();
    });
  }

  createAdmin() {
    this.isAddMode = true;
    this.modalService.open(this.addNewAdminForm, {
      size: 'lg', windowClass: 'confirm-dialog-window',
      centered: true, backdrop: 'static', keyboard: false
    });
    this.adminForm.patchValue({
      IsActive: 1
    });
  }

  onSearchAdmin() {
    // console.log(this.searchForm.value);
  }

  cancelAdmin() {
    this.adminForm.reset();
    this.modalService.dismissAll();
  }

  adminFormValid() {
    return this.adminForm.valid;
  }

  saveAdmin() {
    // this.spinnerService.show();
    if (this.isAddMode) {
      const centerAdminObj = {
        FirstName: this.adminForm.get('FirstName').value,
        LastName: this.adminForm.get('LastName').value,
        PhoneNumber: this.adminForm.get('PhoneNumber').value,
        EmailId: this.adminForm.get('EmailId').value,
        Password: this.adminForm.get('Password').value,
        UserType: rolesEnum.Admin,
        IsActive: this.adminForm.get('IsActive').value,
        Createdby: this.user.Name,
        UpdatedBy: this.user.Name
      };

      this.spinnerService.show();
      this.adminCommonEndpointsService.addUser(centerAdminObj).toPromise().then((result) => {
        if (result.IsSuccessStatusCode) {
          this.messageService.add({ severity: 'success', summary: 'Admin added successfully', detail: '' });
        } else {
          this.messageService.add({ severity: 'warn', summary: 'Admin already exists', detail: '' });
        }
        this.adminForm.reset();
        this.modalService.dismissAll();
        this.spinnerService.hide();
        this.loadAdminData(this.lazyLoadEvent);
      }, (e) => {
        // this.messageService.add({ severity: 'error', summary: 'Error in while adding...', detail: '' });
        this.spinnerService.hide();
        this.modalService.dismissAll();
      });
    } else {
      const centerAdminObj = {
        UserId: this.collectAdmin.UserId,
        FirstName: this.adminForm.get('FirstName').value,
        LastName: this.adminForm.get('LastName').value,
        PhoneNumber: this.adminForm.get('PhoneNumber').value,
        EmailId: this.adminForm.get('EmailId').value,
        Password: this.adminForm.get('Password').value,
        UserType: rolesEnum.Admin,
        IsActive: this.adminForm.get('IsActive').value,
        Createdby: this.user.Name,
        UpdatedBy: this.user.Name
      };
      this.spinnerService.show();
      this.adminCommonEndpointsService.updateUser(centerAdminObj).toPromise().then((result) => {
        this.messageService.add({ severity: 'success', summary: 'Admin updated successfully', detail: '' });
        this.adminForm.reset();
        this.spinnerService.hide();
        this.loadAdminData(this.lazyLoadEvent);
        this.modalService.dismissAll();
      }, (e) => {
        this.messageService.add({ severity: 'error', summary: 'Error in while updating...', detail: '' });
        this.spinnerService.hide();
        this.modalService.dismissAll();
      });
    }
  }

  editAdmin(collectAdmin) {
    this.collectAdmin = collectAdmin;
    this.adminForm.patchValue({
      FirstName: collectAdmin.FirstName,
      LastName: collectAdmin.LastName,
      PhoneNumber: collectAdmin.PhoneNumber,
      EmailId: collectAdmin.EmailId,
      Password: collectAdmin.Password,
      IsActive: collectAdmin.IsActive ? 1 : 0
    });
    this.isAddMode = false;
    this.modalService.open(this.addNewAdminForm, {
      size: 'lg', windowClass: 'confirm-dialog-window',
      centered: true, backdrop: 'static', keyboard: false
    });
  }

  deleteAdmin(admin) {
    this.spinnerService.show();
    this.adminCommonEndpointsService.removeItem(admin.UserId).subscribe(result => {
      this.loadAdminData(this.lazyLoadEvent);
      this.spinnerService.hide();
      this.messageService.add({ severity: 'success', summary: 'Admin deleted successfully', detail: '' });
      this.modalService.dismissAll();
    }, (e) => {
      this.loadAdminData(this.lazyLoadEvent);
      if (e.text) {
        this.messageService.add({ severity: 'success', summary: e.text, detail: '' });
      }
      this.spinnerService.hide();
      // this.messageService.add({severity: 'error', summary: 'Error in while deleting...', detail: ''});
      this.modalService.dismissAll();
    });
  }

  viewAdmin(collectAdmin) {
    this.collectAdmin = collectAdmin;
    this.modalService.open(this.displayAdmins, {
      size: 'lg', windowClass: 'confirm-dialog-window',
      centered: true, backdrop: 'static', keyboard: false
    });
  }

  removeAdmin(collectAdmin) {
    this.collectAdmin = collectAdmin;
    this.modalService.open(this.displayWarningMessage, {
      size: 'md', windowClass: 'confirm-dialog-window',
      centered: false, backdrop: 'static', keyboard: false
    });
  }

  allFormsValid() {
    return this.adminForm.valid;
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
      a.download = 'AdminsReport.csv';
      a.click();
      window.URL.revokeObjectURL(url);
      a.remove();
    }
  }


}
