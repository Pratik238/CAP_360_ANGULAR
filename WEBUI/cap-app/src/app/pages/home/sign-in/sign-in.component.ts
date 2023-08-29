import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { MessageService } from 'primeng/api';
import { ToasterService } from 'src/app/services/toaster.service';
import { rolesEnum } from 'src/app/models/Enum/roles';
import { first } from 'rxjs/operators';
import { AuthenticationService } from '../../../services/authentication.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
    selector: 'app-sign-in',
    templateUrl: './sign-in.component.html',
    styleUrls: ['./sign-in.component.scss']
})
export class SignInComponent implements OnInit {

    loginForm: FormGroup;
    loading = false;
    submitted = false;
    error = '';

    constructor(
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private messageService: MessageService,
        private toasterService: ToasterService,
        private authenticationService: AuthenticationService,
        private spinnerService: NgxSpinnerService
    ) {
        // redirect to home if already logged in
        if (this.authenticationService.userValue) {
            this.router.navigate(['/home/sign-in']);
        }
    }

    ngOnInit() {
        this.loginForm = this.formBuilder.group({
            username: ['', Validators.required],
            password: ['', Validators.required],
            rememberMe: [false]
        });
    }

    allFormsValid() {
        return this.loginForm.valid;
    }

    // convenience getter for easy access to form fields
    get f() { return this.loginForm.controls; }

    onSubmit() {
        this.submitted = true;

        // stop here if form is invalid
        if (this.loginForm.invalid) {
            return;
        }

        this.loading = true;

        this.spinnerService.show();
        this.authenticationService.login(this.f.username.value, this.f.password.value, this.f.rememberMe.value)
            .pipe(first())
            .subscribe({
                next: (res) => {

                    this.spinnerService.hide();
                    // get return url from query parameters or default to home page
                    // const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
                    switch (res.Usertype) {
                        case rolesEnum.Admin:
                            this.router.navigateByUrl('/admin/subject');
                            break;
                        case rolesEnum.SuperAdmin:
                            this.router.navigateByUrl('/admin/super-admin/center-admin');
                            break;
                        case rolesEnum.User:
                            this.router.navigateByUrl('/user/overview/cap-basic-info').then(() => {
                                window.location.reload();
                            });
                            break;
                        case rolesEnum.Tutor:
                            this.router.navigateByUrl('/admin/tutor-online-class');
                            break;
                        case rolesEnum.CenterAdmin:
                            this.router.navigateByUrl('/admin/tutor');
                            break;
                        default:
                            this.toasterService.showError('', 'User Name or Password Incorrect');
                            this.loading = false;
                            break;
                    }
                    // if (res.Usertype === rolesEnum.Admin) {
                    // }
                    // if (res.Usertype === rolesEnum.SuperAdmin) {
                    //     this.router.navigateByUrl('/admin/subject');
                    // }
                    // if (res.Usertype === rolesEnum.User) {
                    //     this.router.navigateByUrl('/user/faq');
                    // }
                    // if (res.Usertype === 0) {
                    //     this.toasterService.showError('', 'User Name or Password Incorrect');
                    //     this.loading = false;
                    // }

                },
                error: error => {
                    this.spinnerService.hide();
                    // this.messageService.add({ severity: 'error', summary: error.Error[0], detail: '' });
                    this.error = error;
                }
            });
    }

    login() {
        this.router.navigate(['/login']);
    }

    signUp() {
        this.router.navigate(['/register']);
    }

    navigateToDashboard() {
        this.router.navigate(['/home/index']);
    }

}
