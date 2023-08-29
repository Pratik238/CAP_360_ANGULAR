import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { LazyLoadEvent, MessageService } from 'primeng/api';
import { rolesEnum } from 'src/app/models/Enum/roles';
import { User } from 'src/app/models/interfaces';
import { AdminCommonEndpointsService } from 'src/app/services/admin-common-endpoints.service';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { ToasterService } from 'src/app/services/toaster.service';

@Component({
  selector: 'app-center-admin',
  templateUrl: './center-admin.component.html',
  styleUrls: ['./center-admin.component.scss']
})
export class CenterAdminComponent implements OnInit {

  @ViewChild('addNewCenterAdminForm') addNewCenterAdminForm: ElementRef;
  @ViewChild('displayCenterAdmin') displayCenterAdmin: ElementRef;
  @ViewChild('displayWarningMessage') displayWarningMessage: ElementRef;
  @ViewChild('datatable') dt;

  value: Date;
  centerAdminForm: FormGroup;
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


  allCenterAdmins: any[] = [];
  user: User;
  centerAdmin: any;
  totalRecords: number;
  isAddMode = true;
  lazyLoadEvent: any;
  dataSource: any[] = [];
  csvData: any[] = [];
  currentstatus = "Active";

  constructor(private adminCommonEndpointsService: AdminCommonEndpointsService,
    private authenticationService: AuthenticationService,
    private spinnerService: NgxSpinnerService,
    private fb: FormBuilder,
    private modalService: NgbModal,
    private toasterService: ToasterService,
    private messageService: MessageService) { }

  ngOnInit() {
    this.user = this.authenticationService.userValue;
    this.centerAdminForm = this.fb.group({
      FirstName: new FormControl('', Validators.required),
      LastName: new FormControl('', Validators.required),
      PhoneNumber: new FormControl('', Validators.compose([Validators.required, Validators.maxLength(10)])),
      EmailId: new FormControl('', [Validators.required, Validators.email]),
      Password: new FormControl('', Validators.required),
      IsActive: new FormControl(1, Validators.required),
    });

    this.loadCenterAdminData(this.lazyLoadEvent)

  }

  addNewCenterAdmin() {
    this.isAddMode = true;
    this.modalService.open(this.addNewCenterAdminForm, {
      size: 'lg', windowClass: 'confirm-dialog-window',
      centered: true, backdrop: 'static', keyboard: false
    });
    this.centerAdminForm.patchValue({
      IsActive: 1
    });
  }

  cancelCenterAdmin() {
    this.centerAdminForm.reset();
    this.modalService.dismissAll();
  }

  centerAdminFormValid() {
    return this.centerAdminForm.valid;
  }

  closeModal() {
    this.centerAdminForm.reset();
  }

  loadStatus(currentStatus, event: LazyLoadEvent) {
    this.currentstatus = currentStatus;
    //this.loadCenterAdminData(event);
    this.loadCenterAdminData(this.lazyLoadEvent);
  }

  pageSizeForATA: number = 10;
  pageIndexChangeForInt(event) {
    this.pageSizeForATA = event.rows;
  }

  loadCenterAdminData(event: LazyLoadEvent) {
    this.spinnerService.show();
    this.lazyLoadEvent = event;
    var isSuperAdmin = 0;
    if (this.user.Usertype === rolesEnum.SuperAdmin) {
      isSuperAdmin = 1;
    } else {
      isSuperAdmin = 0;
    }
    this.adminCommonEndpointsService.getUsersList('4', this.user.UserId, isSuperAdmin, this.currentstatus).subscribe(result => {
      this.csvData = result;

      this.spinnerService.hide();
      this.dataSource = result;
      // this.allCenterAdmins = this.dataSource;
      // if (event && event.first && event.rows) {
      //   this.allCenterAdmins = this.dataSource.slice(event.first, (event.first + event.rows));
      // } else {
      //   this.allCenterAdmins = this.dataSource.slice(0, 10);
      // }
      this.allCenterAdmins = this.dataSource;
      // this.allCenterAdmins = this.dataSource.slice(event.first, (event.first + event.rows));;
      // datatable.reset();
      this.totalRecords = result.length;
      this.dt.reset();
    }, error => {
      this.spinnerService.hide();
    });
  }

  saveCenterAdmin() {
    this.spinnerService.show();
    if (this.isAddMode) {
      const centerAdminObj = {
        FirstName: this.centerAdminForm.get('FirstName').value,
        LastName: this.centerAdminForm.get('LastName').value,
        PhoneNumber: this.centerAdminForm.get('PhoneNumber').value,
        EmailId: this.centerAdminForm.get('EmailId').value,
        Password: this.centerAdminForm.get('Password').value,
        UserType: rolesEnum.CenterAdmin,
        IsActive: this.centerAdminForm.get('IsActive').value,
        Createdby: this.user.Name,
        UpdatedBy: this.user.Name
      };
      this.adminCommonEndpointsService.addUser(centerAdminObj).toPromise().then((result) => {
        if (result.IsSuccessStatusCode) {
          this.messageService.add({ severity: 'success', summary: 'Center admin added successfully', detail: '' });
          this.centerAdminForm.reset();
          this.modalService.dismissAll();
          this.loadCenterAdminData(this.lazyLoadEvent);
        } else {
          this.toasterService.showError('Center admin already exists', 'Validation');
          // this.messageService.add({ severity: 'warn', summary: 'Center admin already exists', detail: '' });
        }
        this.spinnerService.hide();
      }, (e) => {
        // this.messageService.add({ severity: 'error', summary: 'Error in while adding...', detail: '' });
        this.spinnerService.hide();
        //  this.modalService.dismissAll();
      });
    } else {
      const centerAdminObj = {
        UserId: this.centerAdmin.UserId,
        FirstName: this.centerAdminForm.get('FirstName').value,
        LastName: this.centerAdminForm.get('LastName').value,
        PhoneNumber: this.centerAdminForm.get('PhoneNumber').value,
        EmailId: this.centerAdminForm.get('EmailId').value,
        Password: this.centerAdminForm.get('Password').value,
        UserType: rolesEnum.CenterAdmin,
        IsActive: this.centerAdminForm.get('IsActive').value,
        Createdby: this.user.Name,
        UpdatedBy: this.user.Name
      };
      this.adminCommonEndpointsService.updateUser(centerAdminObj).toPromise().then((result) => {
        this.messageService.add({ severity: 'success', summary: 'Center Admin updated successfully', detail: '' });
        this.centerAdminForm.reset();
        this.spinnerService.hide();
        this.loadCenterAdminData(this.lazyLoadEvent);
        this.modalService.dismissAll();
      }, (e) => {
        // this.messageService.add({ severity: 'error', summary: 'Error in while updating...', detail: '' });
        this.spinnerService.hide();
        this.modalService.dismissAll();
      });
    }
  }

  editCenterAdmin(centerAdmin) {
    this.centerAdmin = centerAdmin;
    this.centerAdminForm.patchValue({
      FirstName: centerAdmin.FirstName,
      LastName: centerAdmin.LastName,
      PhoneNumber: centerAdmin.PhoneNumber,
      EmailId: centerAdmin.EmailId,
      Password: centerAdmin.Password,
      UserType: centerAdmin.UserType ? 4 : 0,
      IsActive: centerAdmin.IsActive ? 1 : 0,
    });
    this.isAddMode = false;
    this.modalService.open(this.addNewCenterAdminForm, {
      size: 'lg', windowClass: 'confirm-dialog-window',
      centered: true, backdrop: 'static', keyboard: false
    });
  }

  deleteCenterAdmin(centerAdmin) {
    this.spinnerService.show();
    this.adminCommonEndpointsService.removeItem(centerAdmin.UserId).subscribe(result => {
      this.loadCenterAdminData(this.lazyLoadEvent);
      this.spinnerService.hide();
      this.messageService.add({ severity: 'success', summary: 'Center Admin deleted successfully', detail: '' });
      this.modalService.dismissAll();
    }, (e) => {
      this.loadCenterAdminData(this.lazyLoadEvent);
      if (e.text) {
        this.messageService.add({ severity: 'success', summary: e.text, detail: '' });
      }
      this.spinnerService.hide();
      this.modalService.dismissAll();
    });
  }

  viewCenterAdmin(centerAdmin) {
    this.centerAdmin = centerAdmin;
    this.modalService.open(this.displayCenterAdmin, {
      size: 'lg', windowClass: 'confirm-dialog-window',
      centered: false, backdrop: 'static', keyboard: false
    });
  }

  removeCenterAdmin(centerAdmin) {
    this.centerAdmin = centerAdmin;
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
      a.download = 'CenterAdminsData.csv';
      a.click();
      window.URL.revokeObjectURL(url);
      a.remove();
    }
  }

}
