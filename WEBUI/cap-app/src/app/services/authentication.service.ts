import { Injectable, Injector } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from '../../environments/environment';
import { User } from '../models/interfaces/user';
import { EndpointFactory } from './endpoint-factory.service';
import { MessageService } from 'primeng/api';
import { ToasterService } from './toaster.service';

// @Injectable({ providedIn: 'root' })
@Injectable()
export class AuthenticationService extends EndpointFactory {
    private userSubject: BehaviorSubject<User>;
    public user: Observable<User>;
    rememberMe: boolean = false;
    isLoggedIn: boolean = false;


    constructor(
        private router: Router, protected http: HttpClient, protected messageService: MessageService, injector: Injector, toasterService: ToasterService
    ) {
        super(http, messageService, injector, toasterService)
        this.rememberMe = localStorage.getItem('rememberCurrentUser') == 'true' ? true : false;
        if ((this.rememberMe = true)) {
            this.userSubject = new BehaviorSubject<User>(
                JSON.parse(localStorage.getItem('user'))
            );
        } else {
            this.userSubject = new BehaviorSubject<User>(
                JSON.parse(sessionStorage.getItem('user'))
            );
        }

        // this.userSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('user')));
        this.user = this.userSubject.asObservable();
    }

    public get userValue(): User {
        return this.userSubject.value;
    }

    login(username: string, password: string, isRememberMe: boolean) {
        return this.http.post<any>(`${environment.apiUrl}/api/Authenticate`, { username, password })
            .pipe(map(user => {
                // if (user && user.Token) {
                //     if (isRememberMe) {
                //       this.resetcredentials();
                //       //your logged  out when you click logout
                //       localStorage.setItem('access_token', user.Token);
                //       localStorage.setItem('user', JSON.stringify(user));
                //       localStorage.setItem('rememberCurrentUser', 'true');
                //     } else {
                //       //your logged  out when page/ browser is closed
                //       sessionStorage.setItem('user', JSON.stringify(user));
                //     }
                //     // login successful if there's a jwt token in the response
                //     this.isLoggedIn = true;
                //     this.userSubject.next(user);
                //     return user;
                //   } else {
                //     return user;
                //   }

                // store user details and jwt token in local storage to keep user logged in between page refreshes
                localStorage.setItem('access_token', user.Token);
                localStorage.setItem('user', JSON.stringify(user));
                this.userSubject.next(user);
                return user;
            })).catch(error => {
                return this.handleErrorCommon(error, () => this.login(username, password, isRememberMe))
            });
    }

    resetcredentials() {
        //clear all localstorages
        localStorage.removeItem('rememberCurrentUser');
        localStorage.removeItem('user');
        sessionStorage.removeItem('user');
        this.userSubject.next(null);
    }

    logout() {
        // remove user from local storage to log user out
        localStorage.removeItem('user');
        this.resetcredentials();
        this.userSubject.next(null);
        //this.router.navigate(['/home/sign-in']);
        this.router.navigateByUrl('/home/sign-in').then(() => {
            window.location.reload();
        });
    }
}
