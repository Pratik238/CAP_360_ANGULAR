import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { LazyLoadEvent, MessageService } from 'primeng/api';
import { rolesEnum } from 'src/app/models/Enum/roles';
import { User } from 'src/app/models/interfaces';
import { IAdminTableParams } from 'src/app/models/interfaces/admin-table';
import { AdminCommonEndpointsService } from 'src/app/services/admin-common-endpoints.service';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { CustomvalidationService } from 'src/app/services/Customvalidation.service';

@Component({
  selector: 'app-create-franchise',
  templateUrl: './create-franchise.component.html',
  styleUrls: ['./create-franchise.component.scss']
})
export class CreateFranchiseComponent implements OnInit {

  @ViewChild('displayFranchise') displayFranchise: ElementRef;

  @ViewChild('editSubscribeForm') editSubscribeForm: ElementRef;
  @ViewChild('displayTopics') displayTopics: ElementRef;
  @ViewChild('displayWarningMessage') displayWarningMessage: ElementRef;

  createFranchiseForm: FormGroup;

  statuses: any[] = [
    {
      id: 123,
      value: 'Active'
    },
    {
      id: 124,
      value: 'In-active'
    }
  ];


  allFranchiseData: any[] = [];
  dataSource: any[] = [];
  lazyLoadEvent: any;
  totalRecords: number;
  user: User;
  isAddMode = true;
  collectedFranchiseInfo: any;
  allCenterAdmins: any[] = [];
  csvData: any[] = [];

  countries: any[] = [];

  states: any[] = [];

  cities: any[] = [];

  isChecked = true;
  countrieZipCodeList: any;
  currentSelectedStatus: boolean = true;

  constructor(private httpClient: HttpClient,
    private customValidator: CustomvalidationService,
    private fb: FormBuilder,
    private spinnerService: NgxSpinnerService,
    private adminCommonEndpointsService: AdminCommonEndpointsService,
    private authenticationService: AuthenticationService,
    private modalService: NgbModal,
    private messageService: MessageService) { }

  ngOnInit() {
    this.httpClient.get('assets/USCities.json').subscribe(data => {
      this.countrieZipCodeList = data;
    });

    this.refreshData();

    this.createFranchiseForm = this.fb.group({
      AddressLine: new FormControl('', Validators.required),
      CountryName: new FormControl(null, Validators.required),
      StateName: new FormControl(null, Validators.required),
      CityName: new FormControl(null, Validators.required),
      LocationName: new FormControl(''),
      LocationDisplayName: new FormControl('', Validators.required),
      LocationURL: new FormControl('', Validators.required),
      Zipcode: new FormControl('', Validators.compose([Validators.required, this.customValidator.zipCodeValidation()])),
      latitude: new FormControl('', Validators.required),
      longitude: new FormControl('', Validators.required),
      FranchiseTitle: new FormControl('', Validators.required),
      PhoneNumber: new FormControl('', Validators.compose([Validators.required, Validators.maxLength(10)])),
      FacebookId: new FormControl(''),
      TwitterId: new FormControl(''),
      DomainId: new FormControl(''),
      Email: new FormControl('', [Validators.email]),
      Password: new FormControl(''),
      isEarlyDropOff: new FormControl(''),
      isLatePickUp: new FormControl(''),
      careers: new FormControl(''),
      registration: new FormControl(''),
      openHouse: new FormControl(''),
      summerCamp: new FormControl(''),
      subscribe: new FormControl(''),
      getInTouch: new FormControl(''),
      contactUs: new FormControl(''),
      afterSchool: new FormControl(''),
      studentEvaluation: new FormControl(''),
      reportCard: new FormControl(''),
      debitAuthorization: new FormControl(''),
      teacherEvolution: new FormControl(''),
      enrichment: new FormControl(''),
      Centeradminid: new FormControl(null)
    });
    this.loadFranchiseData(this.lazyLoadEvent);

  }

  refreshData() {
    this.spinnerService.show();
    this.user = this.authenticationService.userValue;
    var isSuperAdmin = 0;
    if (this.user.Usertype === rolesEnum.SuperAdmin) {
      isSuperAdmin = 1;
    } else {
      isSuperAdmin = 0;
    }
    // Center Admin list
    this.adminCommonEndpointsService.getUsersList('4', this.user.UserId, isSuperAdmin).subscribe(result => {
      this.allCenterAdmins = result;
      this.spinnerService.hide();
    }, error => {
      this.spinnerService.hide();
    });
  }

  loadFranchiseData(event: LazyLoadEvent) {
    this.spinnerService.show();
    this.lazyLoadEvent = event;
    this.adminCommonEndpointsService.getCommonLists('vw_Franchise', 'Order by', 'FranchiseId', 'ASC', true).subscribe(result => {
      this.csvData = result;
      this.spinnerService.hide();
      this.dataSource = result;
      this.lazyLoadEvent = event;
      // if (event && event.first && event.rows) {
      //   this.allFranchiseData = this.dataSource.slice(event.first, (event.first + event.rows));
      // } else {
      //   this.allFranchiseData = this.dataSource.slice(0, 10);
      // }
      this.allFranchiseData = this.dataSource;
      this.totalRecords = this.dataSource.length;
    }, error => {

      this.spinnerService.hide();
    });
  }

  filterZipCode(event) {
    this.spinnerService.show();
    if (event.target.value) {
      const obj = this.countrieZipCodeList.find(x => Number(x.zip_code) === Number(event.target.value));
      if (obj !== undefined) {
        this.createFranchiseForm.get('CityName').patchValue(obj.city);
        this.createFranchiseForm.get('StateName').patchValue(obj.state);
        this.createFranchiseForm.get('FranchiseTitle').patchValue(obj.city);
        this.createFranchiseForm.get('latitude').patchValue(obj.latitude);
        this.createFranchiseForm.get('longitude').patchValue(obj.longitude);
        this.createFranchiseForm.get('CountryName').patchValue(obj.county);
        this.spinnerService.hide();
      } else {
        this.createFranchiseForm.get('CityName').patchValue(null);
        this.createFranchiseForm.get('StateName').patchValue(null);
        this.createFranchiseForm.get('FranchiseTitle').patchValue(null);
        this.createFranchiseForm.get('latitude').patchValue(null);
        this.createFranchiseForm.get('longitude').patchValue(null);
        this.createFranchiseForm.get('CountryName').patchValue(null);
        this.spinnerService.hide();
      }
    } else {
      this.spinnerService.hide();
    }
  }

  closeModal() {
    this.createFranchiseForm.reset();
  }

  cancelFranchise() {
    this.createFranchiseForm.reset();
    this.modalService.dismissAll();
  }

  franchiseFormvalid() {
    return this.createFranchiseForm.valid;
  }

  saveFranchise() {
    this.spinnerService.show();
    if (this.isAddMode) {
      let info = {
        // "FranchiseId": this.collectedFranchiseInfo.FranchiseId,
        "AddressLine": this.createFranchiseForm.get('AddressLine').value,
        "CountryName": this.createFranchiseForm.get('CountryName').value,
        "StateName": this.createFranchiseForm.get('StateName').value,
        "CityName": this.createFranchiseForm.get('CityName').value,
        "LocationName": this.createFranchiseForm.get('LocationName').value,
        "LocationDisplayName": this.createFranchiseForm.get('LocationDisplayName').value,
        "LocationURL": this.createFranchiseForm.get('LocationURL').value,
        "Zipcode": this.createFranchiseForm.get('Zipcode').value,
        "PhoneNumber": this.createFranchiseForm.get('PhoneNumber').value,
        "FacebookId": this.createFranchiseForm.get('FacebookId').value,
        "TwitterId": this.createFranchiseForm.get('TwitterId').value,
        "DomainId": this.createFranchiseForm.get('DomainId').value,
        "Email": this.createFranchiseForm.get('Email').value,
        "Password": this.createFranchiseForm.get('Password').value,
        "Centeradminid": this.createFranchiseForm.get('Centeradminid').value,
        "Lattitude": this.createFranchiseForm.get('latitude').value,
        "Longitude": this.createFranchiseForm.get('longitude').value,
        "FranchiseTitle": this.createFranchiseForm.get('FranchiseTitle').value,
        "Createdby": this.user.Name,
        "CreatedDate": new Date(),
        "Updatedby": this.user.Name,
        "UpdatedDate": new Date(),
        "IsActive": true,
        "IsDeleted": false
      }
      const topicsParam: IAdminTableParams = {
        Table: 'Franchise',
        FilterFieldName: 'Centeradminid',
        FilterFieldValue: this.createFranchiseForm.get('Centeradminid').value,
        FilterFieldName1: 'Zipcode',
        FilterFieldValue1: this.createFranchiseForm.get('Zipcode').value,
        Data: [
          {
            FieldName: 'AddressLine',
            FieldValue: this.createFranchiseForm.get('AddressLine').value
          },
          {
            FieldName: 'CountryName',
            FieldValue: this.createFranchiseForm.get('CountryName').value
          },
          {
            FieldName: 'StateName',
            FieldValue: this.createFranchiseForm.get('StateName').value
          },
          {
            FieldName: 'CityName',
            FieldValue: this.createFranchiseForm.get('CityName').value
          },
          {
            FieldName: 'LocationName',
            FieldValue: this.createFranchiseForm.get('LocationName').value
          },
          {
            FieldName: 'FranchiseTitle',
            FieldValue: this.createFranchiseForm.get('FranchiseTitle').value
          },
          {
            FieldName: 'Lattitude',
            FieldValue: this.createFranchiseForm.get('latitude').value
          },
          {
            FieldName: 'Longitude',
            FieldValue: this.createFranchiseForm.get('longitude').value
          },
          {
            FieldName: 'LocationDisplayName',
            FieldValue: this.createFranchiseForm.get('LocationDisplayName').value
          },
          {
            FieldName: 'Centeradminid',
            FieldValue: this.createFranchiseForm.get('Centeradminid').value
          },
          {
            FieldName: 'LocationURL',
            FieldValue: this.createFranchiseForm.get('LocationURL').value
          },
          {
            FieldName: 'Zipcode',
            FieldValue: this.createFranchiseForm.get('Zipcode').value
          },
          {
            FieldName: 'PhoneNumber',
            FieldValue: this.createFranchiseForm.get('PhoneNumber').value
          },
          {
            FieldName: 'FacebookId',
            FieldValue: this.createFranchiseForm.get('FacebookId').value
          },
          {
            FieldName: 'TwitterId',
            FieldValue: this.createFranchiseForm.get('TwitterId').value
          },
          {
            FieldName: 'DomainId',
            FieldValue: this.createFranchiseForm.get('DomainId').value
          },
          {
            FieldName: 'Email',
            FieldValue: this.createFranchiseForm.get('Email').value
          },
          {
            FieldName: 'Password',
            FieldValue: this.createFranchiseForm.get('Password').value
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
      this.adminCommonEndpointsService.createFranchiseRecord(info).toPromise().then((result) => {
        this.messageService.add({ severity: 'success', summary: result['message'], detail: '' });
        this.createFranchiseForm.reset();
        this.spinnerService.hide();
        this.refreshData();
        this.loadFranchiseData(this.lazyLoadEvent);
        this.modalService.dismissAll();
      }, (e) => {
        // if (e.status === 400) {
        //   this.messageService.add({ severity: 'warn', summary: 'already exists', detail: '' });
        // } else {
        //   this.messageService.add({ severity: 'error', summary: e.Error[0], detail: '' });
        // }
        this.spinnerService.hide();
        this.modalService.dismissAll();
      });
    } else {
      let info = {
        "FranchiseId": this.collectedFranchiseInfo.FranchiseId,
        "AddressLine": this.createFranchiseForm.get('AddressLine').value,
        "CountryName": this.createFranchiseForm.get('CountryName').value,
        "StateName": this.createFranchiseForm.get('StateName').value,
        "CityName": this.createFranchiseForm.get('CityName').value,
        "LocationName": this.createFranchiseForm.get('LocationName').value,
        "LocationDisplayName": this.createFranchiseForm.get('LocationDisplayName').value,
        "LocationURL": this.createFranchiseForm.get('LocationURL').value,
        "Zipcode": this.createFranchiseForm.get('Zipcode').value,
        "PhoneNumber": this.createFranchiseForm.get('PhoneNumber').value,
        "FacebookId": this.createFranchiseForm.get('FacebookId').value,
        "TwitterId": this.createFranchiseForm.get('TwitterId').value,
        "DomainId": this.createFranchiseForm.get('DomainId').value,
        "Email": this.createFranchiseForm.get('Email').value,
        "Password": this.createFranchiseForm.get('Password').value,
        "Centeradminid": this.createFranchiseForm.get('Centeradminid').value,
        "Lattitude": this.createFranchiseForm.get('latitude').value,
        "Longitude": this.createFranchiseForm.get('longitude').value,
        "FranchiseTitle": this.createFranchiseForm.get('FranchiseTitle').value,
        "Createdby": this.user.Name,
        "CreatedDate": new Date(),
        "Updatedby": this.user.Name,
        "UpdatedDate": new Date(),
        "IsActive": true,
        "IsDeleted": false
      }
      const topicsParam: IAdminTableParams = {
        Table: 'Franchise',
        Data: [
          {
            FieldName: 'FranchiseId',
            FieldValue: this.collectedFranchiseInfo.FranchiseId
          },
          {
            FieldName: 'AddressLine',
            FieldValue: this.createFranchiseForm.get('AddressLine').value
          },
          {
            FieldName: 'CountryName',
            FieldValue: this.createFranchiseForm.get('CountryName').value
          },
          {
            FieldName: 'StateName',
            FieldValue: this.createFranchiseForm.get('StateName').value
          },
          {
            FieldName: 'CityName',
            FieldValue: this.createFranchiseForm.get('CityName').value
          },
          {
            FieldName: 'FranchiseTitle',
            FieldValue: this.createFranchiseForm.get('FranchiseTitle').value
          },
          {
            FieldName: 'Lattitude',
            FieldValue: this.createFranchiseForm.get('latitude').value
          },
          {
            FieldName: 'Longitude',
            FieldValue: this.createFranchiseForm.get('longitude').value
          },
          {
            FieldName: 'LocationName',
            FieldValue: this.createFranchiseForm.get('LocationName').value
          },
          {
            FieldName: 'LocationDisplayName',
            FieldValue: this.createFranchiseForm.get('LocationDisplayName').value
          },
          {
            FieldName: 'LocationURL',
            FieldValue: this.createFranchiseForm.get('LocationURL').value
          },
          {
            FieldName: 'Zipcode',
            FieldValue: this.createFranchiseForm.get('Zipcode').value
          },
          {
            FieldName: 'PhoneNumber',
            FieldValue: this.createFranchiseForm.get('PhoneNumber').value
          },
          {
            FieldName: 'FacebookId',
            FieldValue: this.createFranchiseForm.get('FacebookId').value
          },
          {
            FieldName: 'TwitterId',
            FieldValue: this.createFranchiseForm.get('TwitterId').value
          },
          {
            FieldName: 'DomainId',
            FieldValue: this.createFranchiseForm.get('DomainId').value
          },
          {
            FieldName: 'Email',
            FieldValue: this.createFranchiseForm.get('Email').value
          },
          {
            FieldName: 'Password',
            FieldValue: this.createFranchiseForm.get('Password').value
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
      this.adminCommonEndpointsService.updateFranchiseRecord(info).toPromise().then((result) => {
        this.messageService.add({ severity: 'success', summary: result['message'], detail: '' });
        this.createFranchiseForm.reset();
        this.isAddMode = true;
        this.spinnerService.hide();
        this.refreshData();
        this.loadFranchiseData(this.lazyLoadEvent);
        this.modalService.dismissAll();
      }, (e) => {
        // this.messageService.add({ severity: 'error', summary: 'Error in while updating...', detail: '' });
        this.spinnerService.hide();
        // this.modalService.dismissAll();
      });
    }
  }

  editFranchise(franchise) {
    console.log("franchise", franchise);
    this.collectedFranchiseInfo = franchise;
    this.createFranchiseForm.patchValue({
      AddressLine: this.collectedFranchiseInfo.AddressLine,
      CountryName: this.collectedFranchiseInfo.CountryName,
      StateName: this.collectedFranchiseInfo.StateName,
      CityName: this.collectedFranchiseInfo.CityName,
      LocationName: this.collectedFranchiseInfo.LocationName,
      LocationDisplayName: this.collectedFranchiseInfo.LocationDisplayName,
      Centeradminid: this.collectedFranchiseInfo.Centeradminid,
      LocationURL: this.collectedFranchiseInfo.LocationURL,
      Zipcode: this.collectedFranchiseInfo.Zipcode.toString(),
      PhoneNumber: this.collectedFranchiseInfo.PhoneNumber,
      FacebookId: this.collectedFranchiseInfo.FacebookId,
      TwitterId: this.createFranchiseForm['TwitterId'],
      DomainId: this.collectedFranchiseInfo.DomainId,
      Email: this.collectedFranchiseInfo.Email,
      Password: this.collectedFranchiseInfo.Password,
      FranchiseTitle: this.collectedFranchiseInfo.FranchiseTitle,
      latitude: this.collectedFranchiseInfo.Lattitude.toString(),
      longitude: this.collectedFranchiseInfo.Longitude,
      CenteradminName: this.collectedFranchiseInfo.CenteradminName,
    });
    this.isAddMode = false;
    // console.log("franchise form", this.collectedFranchiseInfo);
    this.modalService.open(this.editSubscribeForm, {
      size: 'lg', windowClass: 'confirm-dialog-window',
      centered: true, backdrop: 'static', keyboard: false
    });
  }

  deleteFranchise(franchise) {
    this.spinnerService.show();
    // const removeRecord = {
    //   Table: 'Franchise',
    //   PKey: franchise.FranchiseId
    // };
    this.adminCommonEndpointsService.franchiseDeleteRecord(franchise.FranchiseId, franchise.Centeradminid).subscribe(result => {
      this.messageService.add({ severity: 'success', summary: 'Franchise removed successfully', detail: '' });
      this.spinnerService.hide();
      this.refreshData();
      this.loadFranchiseData(this.lazyLoadEvent);
      this.modalService.dismissAll();
    }, (e) => {
      // this.messageService.add({ severity: 'error', summary: 'Error in while removing...', detail: '' });
      this.modalService.dismissAll();
      this.spinnerService.hide();
    });
  }

  viewFranchise(franchise) {
    // console.log(franchise);
    this.createFranchiseForm.patchValue({
      isEarlyDropOff: franchise.isEarlyDropOff,
      isLatePickUp: franchise.isLatePickUp,
      careers: franchise.careers,
      registration: franchise.registration,
      openHouse: franchise.openHouse,
      summerCamp: franchise.summerCamp,
      subscribe: franchise.subscribe,
      getInTouch: franchise.getInTouch,
      contactUs: franchise.contactUs,
      afterSchool: franchise.afterSchool,
      studentEvaluation: franchise.studentEvaluation,
      debitAuthorization: franchise.debitAuthorization,
      teacherEvolution: franchise.teacherEvolution,
      reportCard: franchise.reportCard,
      enrichment: franchise.enrichment,
    });
    this.collectedFranchiseInfo = franchise;
    this.modalService.open(this.displayFranchise, {
      size: 'lg', windowClass: 'confirm-dialog-window',
      centered: false, backdrop: 'static', keyboard: false
    });
  }

  removeFranchise(user) {
    this.user = user;
    this.modalService.open(this.displayWarningMessage, {
      size: 'md', windowClass: 'confirm-dialog-window',
      centered: false, backdrop: 'static', keyboard: false
    });
  }

  createFranchise() {
    const modalRef = this.modalService.open(this.editSubscribeForm, {
      size: 'lg', windowClass: 'confirm-dialog-window',
      centered: true, backdrop: 'static', keyboard: false
    });
    this.isAddMode = true;

  }

  close() {
    this.modalService.dismissAll();
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
      a.download = 'FranchiseReport.csv';
      a.click();
      window.URL.revokeObjectURL(url);
      a.remove();
    }
  }

}
