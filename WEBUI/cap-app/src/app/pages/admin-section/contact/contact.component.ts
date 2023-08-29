import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { LazyLoadEvent, MessageService } from 'primeng/api';
import { rolesEnum } from 'src/app/models/Enum/roles';
import { AdminCommonEndpointsService } from 'src/app/services/admin-common-endpoints.service';
import { AuthenticationService } from 'src/app/services/authentication.service';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss']
})
export class ContactComponent implements OnInit {

  @ViewChild('displayContactDeatils') displayContactDeatils: ElementRef;
  @ViewChild('displayWarningMessage') displayWarningMessage: ElementRef;

  selectedProducts: [];

  value: Date;
  p = 1;

  subTopicsForm: FormGroup;
  submitted = false;

  contacts: any[] = [];
  dataSource: any[] = [];
  totalRecords: number;
  lazyLoadEvent: any;

  user: any;
  isAddMode = true;
  contact: any;
  isActiveRecord: boolean = true;
  currentstatus: string = 'Active';

  constructor(
    private fb: FormBuilder,
    private modalService: NgbModal,
    private adminCommonEndpointsService: AdminCommonEndpointsService,
    private spinnerService: NgxSpinnerService,
    private authenticationService: AuthenticationService,
    private messageService: MessageService) { }

  ngOnInit() {
    this.refreshData();
    this.loadContactData(this.lazyLoadEvent);
  }

  refreshData() {
    this.spinnerService.show();
    this.user = this.authenticationService.userValue;
    this.spinnerService.hide();
  }

  loadContactData(event: LazyLoadEvent) {
    this.spinnerService.show();
    this.lazyLoadEvent = event;
    this.adminCommonEndpointsService.getCommonLists('vw_ContactUs', 'Order by', 'ContactId', 'ASC', this.isActiveRecord).subscribe(result => {
      if (this.user.Usertype === rolesEnum.SuperAdmin) {
        this.dataSource = result;
      } else if (this.user.Usertype === rolesEnum.CenterAdmin) {
        this.dataSource = result.filter(x => x.CenterAdminId === this.user.UserId);
      } else {
        this.dataSource = result.filter(x => x.TutorId === this.user.UserId);
      }
      this.contacts = this.dataSource;
      // this.contacts = this.dataSource.slice(event.first, (event.first + event.rows));
      this.totalRecords = this.dataSource.length;
      this.spinnerService.hide();
    }, error => {
      this.spinnerService.hide();
    });
  }

  getLoadStatusRecords(status: boolean) {
    this.isActiveRecord = status;
    this.loadContactData(this.lazyLoadEvent);
  }

  cancelTopic() {
    this.modalService.dismissAll();
  }

  deleteContact(contact) {
    this.spinnerService.show();
    const removeRecord = {
      Table: 'Contactus',
      PKey: contact.ContactId
    };
    this.adminCommonEndpointsService.changeStatus(removeRecord).subscribe(result => {
      this.messageService.add({ severity: 'success', summary: 'Successfully Updated...', detail: '' });
      this.spinnerService.hide();
      this.loadContactData(this.lazyLoadEvent);
      this.modalService.dismissAll();
    }, (e) => {
      // this.messageService.add({ severity: 'error', summary: 'Error in while updating...', detail: '' });
      this.spinnerService.hide();
      this.modalService.dismissAll();
    });
  }

  viewContact(contact) {
    this.spinnerService.show();
    const viewRecord = {
      Table: 'Contactus',
      PKey: 'ContactId',
      PKeyFld: contact.ContactId
    };
    this.adminCommonEndpointsService.getRecordById(viewRecord).subscribe(result => {
      this.spinnerService.hide();
      this.contact = result[0];
      this.modalService.open(this.displayContactDeatils, {
        size: 'lg', windowClass: 'confirm-dialog-window',
        centered: true, backdrop: 'static', keyboard: false
      });
    }, error => {
      this.spinnerService.hide();
    });
  }

  removeContact(contact) {
    this.contact = contact;
    this.modalService.open(this.displayWarningMessage, {
      size: 'md', windowClass: 'confirm-dialog-window',
      centered: false, backdrop: 'static', keyboard: false
    });
  }

}
