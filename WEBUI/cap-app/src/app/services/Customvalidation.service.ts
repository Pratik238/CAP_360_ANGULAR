import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ValidatorFn, AbstractControl, FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class CustomvalidationService {

  countrieZipCodeList: any;

constructor(private httpClient: HttpClient) {
  this.httpClient.get('assets/USCities.json').subscribe(data =>{
    this.countrieZipCodeList = data;
  });
 }

patternValidator(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } => {
    if (!control.value) {
      return null;
    }
    const regex = new RegExp('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{6,}$');
    const valid = regex.test(control.value);
    return valid ? null : { invalidPassword: true };
  };
}

MatchPassword(password: string, confirmPassword: string) {
  return (formGroup: FormGroup) => {
    const passwordControl = formGroup.controls[password];
    const confirmPasswordControl = formGroup.controls[confirmPassword];

    if (!passwordControl || !confirmPasswordControl) {
      return null;
    }

    if (confirmPasswordControl.errors && !confirmPasswordControl.errors.passwordMismatch) {
      return null;
    }

    if (passwordControl.value !== confirmPasswordControl.value) {
      confirmPasswordControl.setErrors({ passwordMismatch: true });
    } else {
      confirmPasswordControl.setErrors(null);
    }
  };
}

zipCodeValidation(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } => {
    if (!control.value) {
      return null;
    }
    console.log(typeof(control.value));
      const isValid = this.countrieZipCodeList.some(x => x.zip_code.toString().toLowerCase() === control.value.toString().toLowerCase());
      return isValid ? null : { invalidZipcode: true }; 
 };

}

}
