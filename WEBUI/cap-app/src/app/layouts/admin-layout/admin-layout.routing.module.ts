import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AllQuestionsComponent } from '../../pages/admin-section/all-questions/all-questions.component';
import { SubTopicComponent } from '../../pages/admin-section/sub-topic/sub-topic.component';
import { TopicsComponent } from '../../pages/admin-section/topics/topics.component';
import { UsersComponent } from '../../pages/admin-section/users/users.component';
import { AdminsComponent } from '../../pages/admin-section/admins/admins.component';
import { ContactComponent } from '../../pages/admin-section/contact/contact.component';
import { AllFaqComponent } from '../../pages/admin-section/all-faq/all-faq.component';
import { TutorComponent } from 'src/app/pages/admin-section/tutor/tutor.component';
import { SubjectsComponent } from 'src/app/pages/admin-section/subjects/subjects.component';
import { TutorAttendenceComponent } from 'src/app/pages/admin-section/tutor-attendence/tutor-attendence.component';
import { TutorOnlineClassComponent } from 'src/app/pages/admin-section/tutor-online-class/tutor-online-class.component';
import { AuthGuard } from 'src/app/helpers/auth.guard';
import { rolesEnum } from 'src/app/models/Enum/roles';
import { BatchesComponent } from 'src/app/pages/admin-section/batches/batches.component';
import { BatchAssignComponent } from 'src/app/pages/admin-section/batch-assign/batch-assign.component';
import { AdminHomeWorkComponent } from 'src/app/pages/admin-section/admin-home-work/admin-home-work.component';
import { UpdateProfileComponent } from 'src/app/pages/update-profile/update-profile.component';
import { UpdatePasswordComponent } from 'src/app/pages/update-password/update-password.component';
import { HomeworkAssignComponent } from 'src/app/pages/admin-section/homework-assign/homework-assign.component';
import { OnlineClassVideosComponent } from 'src/app/pages/admin-section/online-class-videos/online-class-videos.component';
import { OtherSubjectQuestionsComponent } from 'src/app/pages/admin-section/other-subject-questions/other-subject-questions.component';
import { TutorSatAssignComponent } from 'src/app/pages/admin-section/tutor-sat-assign/tutor-sat-assign.component';
import { ReportCategoriesComponent } from 'src/app/pages/admin-section/report-categories/report-categories.component';
import { HomeworkReportComponent } from 'src/app/pages/admin-section/Reports/homework-report/homework-report.component';
import { SATTestReportComponent } from 'src/app/pages/admin-section/Reports/SAT-test-report/SAT-test-report.component';
import { AdminIssueReportComponent } from 'src/app/pages/admin-section/Reports/admin-issue-report/admin-issue-report.component';
import { AdminExamComponent } from 'src/app/pages/admin-section/Reports/admin-exam/admin-exam.component';
import { AttendanceReportsComponent } from 'src/app/pages/admin-section/attendance-reports/attendance-reports.component';
import { EnglishPracticetestReportComponent } from 'src/app/pages/admin-section/Reports/english-practicetest-report/english-practicetest-report.component';
import { EnglishSatTestReportComponent } from 'src/app/pages/admin-section/Reports/english-sat-test-report/english-sat-test-report.component';
import { EnglishHomeworkReportComponent } from 'src/app/pages/admin-section/Reports/english-homework-report/english-homework-report.component';
import { JumbleTestAssignComponent } from 'src/app/pages/admin-section/jumble-test-assign/jumble-test-assign.component';
import { MathsJumbleTestReportComponent } from 'src/app/pages/admin-section/Reports/maths-jumble-test-report/maths-jumble-test-report.component';
import { EnglishJumbleTestReportComponent } from 'src/app/pages/admin-section/Reports/english-jumble-test-report/english-jumble-test-report.component';
import { PaymentDiscountComponent } from 'src/app/pages/admin-section/payment-discount/payment-discount.component';
// <<<<<<< HEAD
// =======
// import { PaymentDiscountComponent } from 'src/app/pages/admin-section/payment-discount/payment-discount.component';
// >>>>>>> f22a591864c4dbca191997c1f73c63ed7312f789
export const routes: Routes = [
  {
    path: 'all-questions', component: AllQuestionsComponent,
    canActivate: [AuthGuard],
    data: {
      roles: [
        rolesEnum.SuperAdmin,
        rolesEnum.Admin]
    }
  },
  {
    path: 'english-questions', component: OtherSubjectQuestionsComponent,
    canActivate: [AuthGuard],
    data: {
      roles: [
        rolesEnum.SuperAdmin,
        rolesEnum.Admin]
    }
  },
  {
    path: '',
    loadChildren: () => import('src/app/pages/admin-section/super-admin/super-admin.module').then(m => m.SuperAdminModule),
    canActivate: [AuthGuard],
    data: {
      roles: [
        rolesEnum.SuperAdmin,
        rolesEnum.Admin,
        rolesEnum.CenterAdmin]
    }
  },
  {
    path: 'sub-topic',
    component: SubTopicComponent,
    canActivate: [AuthGuard],
    data: {
      roles: [
        rolesEnum.SuperAdmin,
        rolesEnum.Admin]
    }
  },
  {
    path: 'admin-exam',
    component: AdminExamComponent,
    canActivate: [AuthGuard],
    data: {
      roles: [
        rolesEnum.SuperAdmin,
        rolesEnum.Admin]
    }
  },
  {
    path: 'admin-home-work',
    component: AdminHomeWorkComponent,
    canActivate: [AuthGuard],
    data: {
      roles: [
        rolesEnum.SuperAdmin,
        rolesEnum.Admin]
    }
  },
  {
    path: 'topics',
    component: TopicsComponent,
    canActivate: [AuthGuard],
    data: {
      roles: [
        rolesEnum.SuperAdmin,
        rolesEnum.Admin]
    }
  },
  {
    path: 'admin-sat-report',
    component: SATTestReportComponent,
    canActivate: [AuthGuard],
    data: {
      roles: [
        rolesEnum.SuperAdmin,
        rolesEnum.Admin]
    }
  },
  {
    path: 'admin-homework-report',
    component: HomeworkReportComponent,
    canActivate: [AuthGuard],
    data: {
      roles: [
        rolesEnum.SuperAdmin,
        rolesEnum.Admin]
    }
  },
  {
    path: 'admin-issue-report',
    component: AdminIssueReportComponent,
    canActivate: [AuthGuard],
    data: {
      roles: [
        rolesEnum.SuperAdmin,
        rolesEnum.Admin]
    }
  },
  {
    path: 'report-categories',
    component: ReportCategoriesComponent,
    canActivate: [AuthGuard],
    data: {
      roles: [
        rolesEnum.SuperAdmin,
        rolesEnum.Admin]
    }
  },
  {
    path: 'users',
    component: UsersComponent,
    canActivate: [AuthGuard],
    data: {
      roles: [
        rolesEnum.SuperAdmin,
        rolesEnum.Admin,
        rolesEnum.CenterAdmin]
    }
  },
  {
    path: 'batches',
    component: BatchesComponent,
    canActivate: [AuthGuard],
    data: {
      roles: [
        rolesEnum.SuperAdmin,
        rolesEnum.Admin,
        rolesEnum.CenterAdmin]
    }
  },
  {
    path: 'batch-assign',
    component: BatchAssignComponent,
    canActivate: [AuthGuard],
    data: {
      roles: [
        rolesEnum.SuperAdmin,
        rolesEnum.Admin,
        rolesEnum.CenterAdmin]
    }
  },
  {
    path: 'payment-discount',
    component: PaymentDiscountComponent,
    canActivate: [AuthGuard],
    data: {
      roles: [
        rolesEnum.SuperAdmin,
        rolesEnum.Admin,
        rolesEnum.CenterAdmin]
    }
  },
  {
    path: 'subject',
    component: SubjectsComponent,
    canActivate: [AuthGuard],
    data: {
      roles: [
        rolesEnum.SuperAdmin,
        rolesEnum.Admin]
    }
  },
  {
    path: 'tutor',
    component: TutorComponent,
    canActivate: [AuthGuard],
    data: {
      roles: [
        rolesEnum.SuperAdmin,
        rolesEnum.Admin,
        rolesEnum.CenterAdmin]
    }
  },
  {
    path: 'admins',
    component: AdminsComponent,
    canActivate: [AuthGuard],
    data: {
      roles: [
        rolesEnum.SuperAdmin,
        rolesEnum.Admin]
    }
  },
  {
    path: 'contact', component: ContactComponent,
    canActivate: [AuthGuard],
    data: {
      roles: [
        rolesEnum.SuperAdmin,
        rolesEnum.Tutor,
        rolesEnum.CenterAdmin,
        rolesEnum.Admin]
    }
  },
  {
    path: 'all-faq',
    component: AllFaqComponent,
    canActivate: [AuthGuard],
    data: {
      roles: [
        rolesEnum.SuperAdmin,
        rolesEnum.Admin]
    }
  },
  {
    path: 'tutor-attendence',
    component: TutorAttendenceComponent,
    canActivate: [AuthGuard],
    data: {
      roles: [
        rolesEnum.SuperAdmin,
        rolesEnum.Admin,
        rolesEnum.Tutor,
        rolesEnum.CenterAdmin]
    }
  },
  {
    path: 'tutor-online-class',
    component: TutorOnlineClassComponent,
    canActivate: [AuthGuard],
    data: {
      roles: [
        rolesEnum.SuperAdmin,
        rolesEnum.Admin,
        rolesEnum.Tutor,
        rolesEnum.CenterAdmin]
    }
  },
  {
    path: 'homework-assign',
    component: HomeworkAssignComponent,
    canActivate: [AuthGuard],
    data: {
      roles: [
        rolesEnum.SuperAdmin,
        rolesEnum.Admin,
        rolesEnum.Tutor,
        rolesEnum.CenterAdmin]
    }
  },
  {
    path: 'tutor-sat-assign',
    component: TutorSatAssignComponent,
    canActivate: [AuthGuard],
    data: {
      roles: [
        rolesEnum.SuperAdmin,
        rolesEnum.Admin,
        rolesEnum.Tutor,
        rolesEnum.CenterAdmin]
    }
  },
  {
    path: 'attendance-reports',
    component: AttendanceReportsComponent,
    canActivate: [AuthGuard],
    data: {
      roles: [
        rolesEnum.SuperAdmin,
        rolesEnum.Admin,
        rolesEnum.Tutor,
        rolesEnum.CenterAdmin]
    }
  },
  {
    path: 'class-videos',
    component: OnlineClassVideosComponent,
    canActivate: [AuthGuard],
    data: {
      roles: [
        rolesEnum.SuperAdmin,
        rolesEnum.Admin,
        rolesEnum.Tutor,
        rolesEnum.CenterAdmin]
    }
  },
  {
    path: 'tutor-jumble-test',
    component: JumbleTestAssignComponent,
    canActivate: [AuthGuard],
    data: {
      roles: [
        rolesEnum.SuperAdmin,
        rolesEnum.Admin,
        rolesEnum.Tutor,
        rolesEnum.CenterAdmin]
    }
  },
  {
    path: 'tutor-exam',
    component: AdminExamComponent,
    canActivate: [AuthGuard],
    data: {
      roles: [
        rolesEnum.SuperAdmin,
        rolesEnum.Tutor,
        rolesEnum.CenterAdmin,
        rolesEnum.Admin]
    }
  },
  {
    path: 'tutor-sat-report',
    component: SATTestReportComponent,
    canActivate: [AuthGuard],
    data: {
      roles: [
        rolesEnum.SuperAdmin,
        rolesEnum.Tutor,
        rolesEnum.CenterAdmin,
        rolesEnum.Admin]
    }
  },
  {
    path: 'tutor-homework-report',
    component: HomeworkReportComponent,
    canActivate: [AuthGuard],
    data: {
      roles: [
        rolesEnum.SuperAdmin,
        rolesEnum.Tutor,
        rolesEnum.CenterAdmin,
        rolesEnum.Admin]
    }
  },
  {
    path: 'jumbletest-maths-report',
    component: MathsJumbleTestReportComponent,
    canActivate: [AuthGuard],
    data: {
      roles: [
        rolesEnum.SuperAdmin,
        rolesEnum.Tutor,
        rolesEnum.CenterAdmin,
        rolesEnum.Admin]
    }
  },
  {
    path: 'jumbletest-english-report',
    component: EnglishJumbleTestReportComponent,
    canActivate: [AuthGuard],
    data: {
      roles: [
        rolesEnum.SuperAdmin,
        rolesEnum.Tutor,
        rolesEnum.CenterAdmin,
        rolesEnum.Admin]
    }
  },
  {
    path: 'tutor-english-test-report',
    component: EnglishPracticetestReportComponent,
    canActivate: [AuthGuard],
    data: {
      roles: [
        rolesEnum.SuperAdmin,
        rolesEnum.Tutor,
        rolesEnum.CenterAdmin,
        rolesEnum.Admin]
    }
  },
  {
    path: 'tutor-english-sat-report',
    component: EnglishSatTestReportComponent,
    canActivate: [AuthGuard],
    data: {
      roles: [
        rolesEnum.SuperAdmin,
        rolesEnum.Tutor,
        rolesEnum.CenterAdmin,
        rolesEnum.Admin]
    }
  },
  {
    path: 'tutor-english-homework-report',
    component: EnglishHomeworkReportComponent,
    canActivate: [AuthGuard],
    data: {
      roles: [
        rolesEnum.SuperAdmin,
        rolesEnum.Tutor,
        rolesEnum.CenterAdmin,
        rolesEnum.Admin]
    }
  },
  {
    path: 'tutor-issue-report',
    component: AdminIssueReportComponent,
    canActivate: [AuthGuard],
    data: {
      roles: [
        rolesEnum.SuperAdmin,
        rolesEnum.Tutor,
        rolesEnum.CenterAdmin,
        rolesEnum.Admin]
    }
  },
  {
    path: 'update-profile',
    component: UpdateProfileComponent
  },
  {
    path: 'update-password',
    component: UpdatePasswordComponent
  }
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminLayoutRoutingModule {

}

export const routedComponents = [
  AllQuestionsComponent,
  OtherSubjectQuestionsComponent,
  TopicsComponent,
  AdminExamComponent,
  SubTopicComponent,
  AdminIssueReportComponent,
  UsersComponent,
  AdminsComponent,
  ContactComponent,
  AllFaqComponent,
  TutorComponent,
  SubjectsComponent,
  TutorAttendenceComponent,
  TutorOnlineClassComponent,
  BatchesComponent,
  BatchAssignComponent,
  AdminHomeWorkComponent,
  UpdateProfileComponent,
  UpdatePasswordComponent,
  HomeworkAssignComponent,
  TutorSatAssignComponent,
  OnlineClassVideosComponent,
  AttendanceReportsComponent,
  ReportCategoriesComponent,
  SATTestReportComponent,
  HomeworkReportComponent,
  EnglishPracticetestReportComponent,
  EnglishSatTestReportComponent,
  EnglishHomeworkReportComponent,
  JumbleTestAssignComponent,
  MathsJumbleTestReportComponent,
  EnglishJumbleTestReportComponent,
  PaymentDiscountComponent
];
