import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Validators, FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { ToasterService } from '../services/toaster.service';
import { CustomvalidationService } from '../services/Customvalidation.service';
import { AdminCommonEndpointsService } from '../services/admin-common-endpoints.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { MessageService } from 'primeng/api';
import { StudentCommonEndpointsService } from '../services/student-common-endpoints.service';
import { HttpClient } from '@angular/common/http';
import { DataProvider } from '../helpers/providers/data.provider';
@Component({
  selector: 'app-register-user',
  templateUrl: 'register-user.component.html',
  styleUrls: ['register-user.component.scss']
})
export class RegisterUserComponent implements OnInit {

  userform: FormGroup;

  name: string;

  emailId: string;

  password: string;

  submitted = false;
  selectedCategory: string;

  studentAge: any[] = [
    { id: 5, age: 10 },
    { id: 6, age: 11 },
    { id: 7, age: 12 },
    { id: 8, age: 13 },
    { id: 9, age: 14 },
    { id: 10, age: 15 }
  ];

  studentGrade: any[] = [
    { id: 5, value: '5th' },
    { id: 6, value: '6th' },
    { id: 7, value: '7th' },
    { id: 8, value: '8th' },
    { id: 9, value: '9th' },
    { id: 10, value: '10th' },
    { id: 10, value: '11th' }
  ];

  programs: any[] = [
    {
      id: 1, name: 'SMARTSAT', programCost: '$99'
    },
    { id: 2, name: 'CAP360', programCost: '$249' },
    { id: 3, name: 'Boot Camps', programCost: '' },
    { id: 4, name: 'Counselling', programCost: '' }
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

  isSelectedOther = false;
  countrieZipCodeList: any;
  availableCenters: any[] = [];
  isProgramCost: string = '';

  constructor(private httpClient: HttpClient,
    private customValidator: CustomvalidationService,
    private spinnerService: NgxSpinnerService,
    private adminCommonEndpointsService: AdminCommonEndpointsService,
    private studentCommonEndpointsService: StudentCommonEndpointsService,
    private router: Router,
    private fb: FormBuilder,
    private dataProvider: DataProvider,
    private messageService: MessageService,
    private toastService: ToasterService) { }

  ngOnInit() {

    this.httpClient.get('assets/USCities.json').subscribe(data => {
      this.countrieZipCodeList = data;
    });
    this.userform = this.fb.group({
      StudentFirstName: new FormControl('', Validators.required),
      StudentLastName: new FormControl('', Validators.required),
      Age: new FormControl(null, Validators.required),
      ParentFirstName: new FormControl('', Validators.required),
      ParentLastName: new FormControl('', Validators.required),
      Contactno: new FormControl('', Validators.compose([Validators.required, Validators.maxLength(10)])),
      Grade: new FormControl(null, Validators.required),
      FranchiseId: new FormControl(null, Validators.required),
      EmailId: new FormControl('', [Validators.required, Validators.email]),
      Program: new FormControl('', Validators.required),
      StreetAddress: new FormControl('', Validators.required),
      StreetAddress2: new FormControl('', Validators.required),
      City: new FormControl('', Validators.required),
      State: new FormControl('', Validators.required),
      Zipcode: new FormControl('', Validators.compose([Validators.required, this.customValidator.zipCodeValidation()])),
      CountryName: new FormControl(null, Validators.required),
      HearAboutUs: new FormControl(null),
      IsAdsoEmploye: new FormControl(null),
      OtherExplanation: new FormControl(null),
      Password: new FormControl('', Validators.compose([Validators.required, this.customValidator.patternValidator()])),
      confirmPassword: new FormControl('', Validators.required),
    },
      {
        validator: this.customValidator.MatchPassword('Password', 'confirmPassword'),
      }
    );

  }

  filterZipCode(event) {
    if (event.target.value) {
      const obj = this.countrieZipCodeList.find(x => Number(x.zip_code) === Number(event.target.value));
      if (obj !== undefined) {
        this.spinnerService.show();
        this.studentCommonEndpointsService.getFranchisebasedonlattitude(obj.latitude, obj.longitude).subscribe(result => {
          this.spinnerService.hide();
          this.availableCenters = result;
          this.availableCenters.map(x => {
            x['FranchiseMappedName'] = x.CityName + ' (' + x.StateName + ' ' + x.Zipcode + ')';
            x['FranchiseId'] = x.FranchiseId;
          });
        }, error => {
          this.spinnerService.hide();
        });
        this.userform.get('City').patchValue(obj.city);
        this.userform.get('State').patchValue(obj.state);
        this.userform.get('CountryName').patchValue(obj.county);
        // this.spinnerService.hide();
      } else {
        this.userform.get('City').patchValue(null);
        this.userform.get('State').patchValue(null);
        this.userform.get('CountryName').patchValue(null);
        this.spinnerService.hide();
      }
    } else {
      this.spinnerService.hide();
    }
  }

  // convenience getter for easy access to form fields
  get f() { return this.userform.controls; }

  onClickRegisterUser() {
    this.spinnerService.show();
    const studentObj = {
      StudentFirstName: this.userform.get('StudentFirstName').value,
      StudentLastName: this.userform.get('StudentLastName').value,
      Age: this.userform.get('Age').value,
      ParentFirstName: this.userform.get('ParentFirstName').value,
      ParentLastName: this.userform.get('ParentLastName').value,
      Contactno: this.userform.get('Contactno').value,
      Grade: this.userform.get('Grade').value,
      FranchiseId: this.userform.get('FranchiseId').value,
      EmailId: this.userform.get('EmailId').value,
      Password: this.userform.get('Password').value,
      Program: this.userform.get('Program').value,
      StreetAddress: this.userform.get('StreetAddress').value,
      StreetAddress2: this.userform.get('StreetAddress2').value,
      City: this.userform.get('City').value,
      State: this.userform.get('State').value,
      Zipcode: this.userform.get('Zipcode').value,
      CountryName: this.userform.get('CountryName').value,
      HearAboutUs: this.userform.get('HearAboutUs').value,
      OtherExplanation: this.userform.get('OtherExplanation').value,
      IsAdsoEmploye: this.userform.get('IsAdsoEmploye').value
    };
    // if (studentObj.IsAdsoEmploye) {
    this.adminCommonEndpointsService.addStudent(studentObj).toPromise().then((result) => {
      // this.studentCommonEndpointsService.messageSent(studentObj.Contactno).toPromise().then(res => {

      this.spinnerService.hide();
      // });
      if (result.IsSuccessStatusCode) {
        this.toastService.showSuccess('', 'Student added successfully');
      } else {
        this.toastService.showWarning('', 'Student already exists');
      }
      this.userform.reset();
      this.dataProvider.storage = {
        studentEmailId: studentObj.EmailId,
        PlanId: studentObj.Program
      };

      if (studentObj.Program == 'Boot Camps' || studentObj.Program == 'Counselling') {
        this.router.navigate(['/login']);
      }

      if (studentObj.IsAdsoEmploye == true) {
        this.router.navigate(['/login']);
      } else {
        this.router.navigate(['/register/student-payment-gateway']);
      }
    }, (e) => {
      this.spinnerService.hide();
      // this.toastService.showError(e, 'Error in while adding...');
      // this.messageService.add({ severity: 'error', summary: 'Error in while adding...', detail: '' });
      this.router.navigate(['/login']);
    });
    // } else {

    // }
  }

  onClickGoToLogin() {
    this.router.navigate(['/login']);
  }

  allFormsValid() {
    return this.userform.valid;
  }

  selectChangeHandler(event: any) {
    const selectedOption = event.target.value;
    if (selectedOption === 'Other') {
      this.isSelectedOther = true;
    } else {
      this.isSelectedOther = false;
    }
  }

  onChangeProgram(event) {
    if (event.target.value) {
      this.isProgramCost = this.getProgramCostByName(event.target.value);
    }
  }

  getProgramCostByName(name: string) {
    return this.programs && this.programs.filter(x => x.name.trim().toLowerCase() === name.trim().toLowerCase()).length > 0
      ? this.programs.find(x => x.name.trim().toLowerCase() === name.trim().toLowerCase()).programCost
      : null;
  }

}

