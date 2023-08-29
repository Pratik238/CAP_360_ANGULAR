import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { LazyLoadEvent, MessageService } from 'primeng/api';
import { rolesEnum } from 'src/app/models/Enum/roles';
import { User } from 'src/app/models/interfaces';
import { AdminCommonEndpointsService } from 'src/app/services/admin-common-endpoints.service';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { CustomvalidationService } from 'src/app/services/Customvalidation.service';
import { StudentCommonEndpointsService } from 'src/app/services/student-common-endpoints.service';

@Component({
  selector: 'app-payment-discount',
  templateUrl: './payment-discount.component.html',
  styleUrls: ['./payment-discount.component.scss']
})
export class PaymentDiscountComponent implements OnInit {

  @ViewChild('addNewSubTopicForm') addNewSubTopicForm: ElementRef;
  @ViewChild('displayTopics') displayTopics: ElementRef;
  @ViewChild('displayWarningMessage') displayWarningMessage: ElementRef;

  selectedProducts: [];
  currentstatus = 'Active';
  value: Date;
  totalRecords: number;

  tutorForm: FormGroup;
  submitted = false;

  userTypes: any[] = [
    {
      userTypeId: 2,
      userTypeValue: 'UserType',
    },
  ];

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

  generalInfo: any[] = [
    {
      id: 1,
      value: 'Google'
    },
    {
      id: 2,
      value: 'Email'
    },
    {
      id: 3,
      value: 'Facebook'
    },
    {
      id: 4,
      value: 'Website'
    },
    {
      id: 5,
      value: 'From a friend'
    },
    {
      id: 6,
      value: 'Other'
    }
  ];

  programs: any[] = [
    {
      id: 1, name: 'SMARTSAT', isDisable: false, programCost: 99
    },
    { id: 2, name: 'CAP360', isDisable: false, programCost: 249 },
    { id: 3, name: 'Boot Camps', isDisable: false, programCost: '' },
    { id: 4, name: 'Counselling', isDisable: false, programCost: '' }
  ];

  isProgramCost: string = '';

  allUsers: any[] = [];
  dataSource: any[] = [];
  lazyLoadEvent: any;
  user: User;
  isAddMode = true;
  tutorData: any;
  isSelectedOther: boolean = false;
  countrieZipCodeList: any;
  availableCenters: any[] = [];

  constructor(private httpClient: HttpClient,
    private spinnerService: NgxSpinnerService,
    private customValidator: CustomvalidationService,
    private adminCommonEndpointsService: AdminCommonEndpointsService,
    private fb: FormBuilder,
    private authenticationService: AuthenticationService,
    private studentCommonEndpointsService: StudentCommonEndpointsService,
    private modalService: NgbModal,
    private messageService: MessageService) { }

  ngOnInit() {
    this.user = this.authenticationService.userValue;
    this.httpClient.get('assets/USCities.json').subscribe(data => {
      this.countrieZipCodeList = data;
    });
    this.tutorForm = this.fb.group({
      StudentFirstName: new FormControl('', Validators.required),
      StudentLastName: new FormControl('', Validators.required),
      Contactno: new FormControl('', Validators.compose([Validators.required, Validators.maxLength(10)])),
      EmailId: new FormControl('', [Validators.required, Validators.email]),
      Password: new FormControl('', Validators.required),
      Program: new FormControl('', Validators.required),
      Age: new FormControl(null, Validators.required),
      Discount: new FormControl(null, Validators.required),
      ParentFirstName: new FormControl('', Validators.required),
      ParentLastName: new FormControl('', Validators.required),
      Grade: new FormControl(null, Validators.required),
      FranchiseId: new FormControl(null, Validators.required),
      StreetAddress: new FormControl('', Validators.required),
      StreetAddress2: new FormControl('', Validators.required),
      City: new FormControl('', Validators.required),
      State: new FormControl('', Validators.required),
      Zipcode: new FormControl('', Validators.compose([Validators.required, this.customValidator.zipCodeValidation()])),
      CountryName: new FormControl(null, Validators.required),
      HearAboutUs: new FormControl(null, Validators.required),
      OtherExplanation: new FormControl(null),
    });
    this.loadUsersData(this.lazyLoadEvent);

  }

  loadUsersData(event: LazyLoadEvent, status = 'Active') {
    this.spinnerService.show();
    this.currentstatus = status;
    this.lazyLoadEvent = event;
    var isSuperAdmin = 0;
    if (this.user.Usertype === rolesEnum.SuperAdmin) {
      isSuperAdmin = 1;
    } else {
      isSuperAdmin = 0;
    }
    this.adminCommonEndpointsService.DiscountedStudentList('2', this.user.UserId, isSuperAdmin).subscribe(result => {
      this.dataSource = result;
      // if (event && event.first && event.rows) {
      //   this.allUsers = this.dataSource.slice(event.first, (event.first + event.rows));
      // } else {
      //   this.allUsers = this.dataSource.slice(0, 10);
      // }

      this.allUsers = this.dataSource;
      // this.allUsers = this.dataSource.slice(event.first, (event.first + event.rows));
      this.totalRecords = this.dataSource.length;
      this.spinnerService.hide();
    }, error => {
      this.spinnerService.hide();
    });
  }

  addNewSubTopic() {
    this.modalService.open(this.addNewSubTopicForm, {
      size: 'lg', windowClass: 'confirm-dialog-window',
      centered: true, backdrop: 'static', keyboard: false
    });
  }

  cancelStudentInfo() {
    this.modalService.dismissAll();
    this.tutorForm.reset();
  }

  studentFormValid() {
    return this.tutorForm.valid;
  }

  selectChangeHandler(event: any) {
    const selectedOption = event.target.value;
    if (selectedOption === 'Other') {
      this.isSelectedOther = true;
    } else {
      this.isSelectedOther = false;
    }
  }

  filterZipCode(value) {
    if (value) {
      const obj = this.countrieZipCodeList.find(x => Number(x.zip_code) === Number(value));
      if (obj !== undefined) {
        this.spinnerService.show();
        this.studentCommonEndpointsService.getFranchisebasedonlattitude(obj.latitude, obj.longitude).subscribe(result => {
          this.availableCenters = result;
          this.spinnerService.hide();
          this.availableCenters.map(x => {
            x['FranchiseMappedName'] = x.CityName + ' (' + x.StateName + ' ' + x.Zipcode + ')';
            x['FranchiseId'] = x.FranchiseId;
          });
        }, error => {
          this.spinnerService.hide();
        });
        this.tutorForm.get('City').patchValue(obj.city);
        this.tutorForm.get('State').patchValue(obj.state);
        this.tutorForm.get('CountryName').patchValue(obj.county);
      } else {
        this.tutorForm.get('City').patchValue(null);
        this.tutorForm.get('State').patchValue(null);
        this.tutorForm.get('CountryName').patchValue(null);
      }
    } else {
      // this.spinnerService.hide();
    }
  }

  editUsers(student) {
    this.tutorData = student;
    this.filterZipCode(student.Zipcode);
    const programId = this.getProgrameIdByName(student.Program);
    this.isProgramCost = this.getProgramCostByName(student.Program);
    this.tutorForm.patchValue({
      StudentFirstName: student.StudentFirstName,
      StudentLastName: student.StudentLastName,
      Contactno: student.Contactno,
      EmailId: student.EmailId,
      Password: student.Password,
      City: student.City,
      CountryName: student.CountryName,
      FranchiseTitle: student.FranchiseTitle,
      HearAboutUs: student.HearAboutUs,
      OtherExplanation: student.OtherExplanation,
      Program: student.Program,
      State: student.State,
      Zipcode: student.Zipcode,
      FranchiseId: student.FranchiseId,
      StreetAddress: student.StreetAddress,
      StreetAddress2: student.StreetAddress2,
      Discount: student.Discount
    });
    this.isAddMode = false;
    this.modalService.open(this.addNewSubTopicForm, {
      size: 'lg', windowClass: 'confirm-dialog-window',
      centered: true, backdrop: 'static', keyboard: false
    });
  }

  getProgramCostByName(name: string) {
    return this.programs && this.programs.filter(x => x.name.trim().toLowerCase() === name.trim().toLowerCase()).length > 0
      ? this.programs.find(x => x.name.trim().toLowerCase() === name.trim().toLowerCase()).programCost
      : null;
  }
  getProgrameIdByName(programName) {
    return this.programs && this.programs.filter(x => x.name.trim().toLowerCase() === programName.trim().toLowerCase()).length > 0
      ? this.programs.find(x => x.name.trim().toLowerCase() === programName.trim().toLowerCase()).id
      : null;
  }

  saveStudentInfo() {
    this.spinnerService.show();
    this.modalService.dismissAll();
    const tutorObj = {
      StudentId: this.tutorData.StudentId,

      EmailId: this.tutorForm.get('EmailId').value,
      Discount: this.tutorForm.get('Discount').value,

      Program: this.tutorForm.get('Program').value,
      CreatedDate: this.tutorData.CreatedDate

    };
    this.adminCommonEndpointsService.UpdateStudentDiscountInfoMethod(tutorObj).toPromise().then((result) => {
      this.messageService.add({ severity: 'success', summary: 'User updated successfully', detail: '' });
      this.tutorForm.reset();
      this.spinnerService.hide();
      this.loadUsersData(this.lazyLoadEvent);
      this.modalService.dismissAll();
    }, (e) => {
      this.spinnerService.hide();
      // this.messageService.add({ severity: 'success', summary: 'Profile Updated Sucessfully...', detail: '' });
      this.loadUsersData(this.lazyLoadEvent);
      this.modalService.dismissAll();
    });
  }

  deleteTopic(user) {
    this.spinnerService.show();
    this.adminCommonEndpointsService.removeStudent(user.StudentId).subscribe(result => {
      this.loadUsersData(this.lazyLoadEvent);
      this.spinnerService.hide();
      this.messageService.add({ severity: 'success', summary: 'User deleted successfully', detail: '' });
      this.modalService.dismissAll();
    }, (e) => {
      this.spinnerService.hide();
      this.loadUsersData(this.lazyLoadEvent);;
      // if (e.text) {
      //   this.messageService.add({ severity: 'success', summary: e.text, detail: '' });
      // }
      // this.messageService.add({severity: 'error', summary: 'Error in while removing...', detail: ''});
      this.modalService.dismissAll();
    });
  }

  viewTopic(tutorData) {
    this.tutorData = tutorData;
    this.modalService.open(this.displayTopics, {
      size: 'lg', windowClass: 'confirm-dialog-window',
      centered: false, backdrop: 'static', keyboard: false
    });
  }

  removeTopic(tutorData) {
    this.tutorData = tutorData;
    this.modalService.open(this.displayWarningMessage, {
      size: 'md', windowClass: 'confirm-dialog-window',
      centered: false, backdrop: 'static', keyboard: false
    });
  }
}
