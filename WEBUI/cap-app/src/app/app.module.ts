import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app.routing.module';

import { JwtInterceptor, ErrorInterceptor } from './helpers';
import { AppCommonModule } from './app.common.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ToastrModule } from 'ngx-toastr';
import { ComponentsModule } from './components/components.module';
import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';
import { UsersLayoutComponent } from './layouts/users-layout/users-layout.component';
import { UsersLayoutModule } from './layouts/users-layout/users-layout.module';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { LoginComponent } from './login/login.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { HomePageLayoutComponent } from './layouts/home-page-layout/home-page-layout.component';
import { HomePageLayoutModule } from './layouts/home-page-layout/home-page-layout.module';
import { TableModule } from 'primeng/table';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { AdminCommonEndpointsService } from './services/admin-common-endpoints.service';
import { EndpointFactory } from './services/endpoint-factory.service';
import { StudentCommonEndpointsService } from './services/student-common-endpoints.service';
import { AuthenticationService } from './services/authentication.service';
@NgModule({
    imports: [
        BrowserModule,
        HomePageLayoutModule,
        ReactiveFormsModule,
        HttpClientModule,
        AppRoutingModule,
        AppCommonModule,
        BrowserAnimationsModule,
        NgbModule,
        MatTooltipModule,
        FormsModule,
        UsersLayoutModule,
        ComponentsModule,
        TableModule,
        CKEditorModule,
        ToastrModule.forRoot(
            {
                timeOut: 1000,
                positionClass: 'toast-top-right'
            }
        )
    ],
    declarations: [
        AppComponent,
        UsersLayoutComponent,
        LoginComponent,
        AdminLayoutComponent,
        HomePageLayoutComponent,
        ForgotPasswordComponent
    ],
    exports: [
        MatTooltipModule,
        TableModule,
    ],
    providers: [
        { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
        { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
        AdminCommonEndpointsService,
        StudentCommonEndpointsService,
        AuthenticationService,
        EndpointFactory

    ],
    bootstrap: [AppComponent]
})

export class AppModule { }
