import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LoginComponent } from './login/login.component';
import { ErrorComponent } from './shared/error/error.component';
import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';
import { AuthGuard } from './helpers/auth.guard';
import { UsersLayoutComponent } from './layouts/users-layout/users-layout.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { rolesEnum } from './models/Enum/roles';
import { UpdateProfileComponent } from './pages/update-profile/update-profile.component';
import { UpdatePasswordComponent } from './pages/update-password/update-password.component';
import { HomePageLayoutComponent } from './layouts/home-page-layout/home-page-layout.component';

const routes: Routes = [
    {
        path: 'login',
        component: LoginComponent
    },
    {
        path: 'forgot-password',
        component: ForgotPasswordComponent,
    },
    {
        path: 'register',
        loadChildren: () => import('src/app/register-user/register-user.module').then(m => m.RegisterUserModule)
    },
    {
        path: 'admin',
        component: AdminLayoutComponent,
        children: [
            {
                path: '',
                loadChildren: () => import('src/app/layouts/admin-layout/admin-layout.module').then(m => m.AdminLayoutModule),
            }
        ]
    },
    {
        path: '',
        component: HomePageLayoutComponent,
        loadChildren: () => import('src/app/pages/home/home.module').then(m => m.HomeModule),
    },
    {
        path: 'user',
        component: UsersLayoutComponent,
        children: [
            {
                path: 'faq',
                loadChildren: () => import('src/app/pages/students-section/faq/faq.module').then(m => m.FaqModule),
                canActivate: [AuthGuard],
                data: { roles: [rolesEnum.User] }
            },
            {
                path: 'contactus',
                loadChildren: () => import('src/app/pages/students-section/contactus/contactus.module').then(m => m.ContactUsModule),
                canActivate: [AuthGuard],
                data: { roles: [rolesEnum.User] }
            },
            {
                path: '',
                loadChildren: () => import('src/app/pages/students-section/score-card/score-card.module').then(m => m.ScoreCardModule),
                canActivate: [AuthGuard],
                data: { roles: [rolesEnum.User] }
            },
            {
                path: 'exam',
                loadChildren: () => import('src/app/pages/students-section/exam/exam.module').then(m => m.ExamModule),
                canActivate: [AuthGuard],
                data: { roles: [rolesEnum.User] }
            },
            {
                path: '',
                loadChildren: () => import('src/app/pages/students-section/test/test.module').then(m => m.TestModule),
                canActivate: [AuthGuard],
                data: { roles: [rolesEnum.User] }
            },
            {
                path: '',
                loadChildren: () => import('src/app/pages/students-section/tutoring/tutoring.module').then(m => m.TutoringModule),
                canActivate: [AuthGuard],
                data: { roles: [rolesEnum.User] }
            },
            {
                path: '',
                loadChildren: () => import('src/app/pages/students-section/overview/overview.module').then(m => m.OverviewModule),
                canActivate: [AuthGuard],
                data: { roles: [rolesEnum.User] }
            },
            {
                path: '',
                loadChildren: () => import('src/app/pages/students-section/tuition/tuition.module').then(m => m.TuitionModule),
                canActivate: [AuthGuard],
                data: { roles: [rolesEnum.User] }
            },
            {
                path: 'update-profile',
                canActivate: [AuthGuard],
                component: UpdateProfileComponent
            },
            {
                path: 'update-password',
                canActivate: [AuthGuard],
                component: UpdatePasswordComponent
            },
            {
                path: '',
                loadChildren: () => import('src/app/pages/students-section/exam-result-questions/exam-result-questions.module').then(m => m.ExamResultQuestionsModule),
                canActivate: [AuthGuard],
                data: { roles: [rolesEnum.User] }
            }
        ]
    },
    {
        path: 'start-exam',
        loadChildren: () => import('src/app/pages/students-section/start-exam/start-exam.module').then(m => m.StartExamModule),
        canActivate: [AuthGuard],
        // canDeactivate: [CanDeactivateGuard]
        data: { roles: [rolesEnum.User] }
    },
    {
        path: 'english-exam',
        loadChildren: () => import('src/app/pages/students-section/english-test/english-test.module').then(m => m.EnglishTestModule),
        canActivate: [AuthGuard],
        // canDeactivate: [CanDeactivateGuard]
        data: { roles: [rolesEnum.User] }
    },
    {
        path: 'error',
        component: ErrorComponent,
    },
    // otherwise redirect to home
    {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full'
    },
    {
        path: '**',
        redirectTo: 'error',
        pathMatch: 'full'
    }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
    providers: [
    ]
})
export class AppRoutingModule { }
