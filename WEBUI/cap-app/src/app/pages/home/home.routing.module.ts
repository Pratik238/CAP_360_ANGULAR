import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdmissionFormComponent } from './admission-form/admission-form.component';

import { BootcampComponent } from './bootcamp/bootcamp.component';
import { CapIndexComponent } from './cap-index/cap-index.component';
import { Cap360Component } from './cap360/cap360.component';
import { GalleryComponent } from './gallery/gallery.component';
import { GoogleMapsComponent } from './google-maps/google-maps.component';
import { HomeContactUsComponent } from './home-contact-us/home-contact-us.component';
import { HomePageFaqComponent } from './home-page-faq/home-page-faq.component';
import { HomeWhyCapComponent } from './home-why-cap/home-why-cap.component';
import { HomeComponent } from './home.component';
import { OurProgramsComponent } from './our-programs/our-programs.component';
import { PrivacyPolicyComponent } from './privacy-policy/privacy-policy.component';
import { ProgramsComponent } from './programs/programs.component';
import { SignInComponent } from './sign-in/sign-in.component';
import { SmartsatComponent } from './smartsat/smartsat.component';
import { TeamComponent } from './team/team.component';
import { TermsConditionsComponent } from './terms-conditions/terms-conditions.component';
import { WhoWeAreComponent } from './who-we-are/who-we-are.component';

const routes: Routes = [
    {
        path: '',
        redirectTo: 'home'
    },
    {
        path: 'home',
        component: HomeComponent,
        children: [
            {
              path: '',
              component: ProgramsComponent, //CapIndexComponent,
            },
            {
              path: 'programs',
              component: ProgramsComponent,
            },
            {
              path: 'smartsat',
              component: SmartsatComponent,
            },
            {
              path: 'our-program',
              component: OurProgramsComponent,
            },
            {
              path: 'cap-360',
              component: Cap360Component,
            },
            {
              path: 'bootcamp',
              component: BootcampComponent,
            },
            {
              path: 'why-cap',
              component: HomeWhyCapComponent,
            },
            {
              path: 'who-we-are',
              component: WhoWeAreComponent,
            },
            {
              path: 'team',
              component: TeamComponent,
            },
            {
              path: 'gallery',
              component: GalleryComponent,
            },
            {
              path: 'contact-us',
              component: HomeContactUsComponent,
            },
            {
              path: 'faqs',
              component: HomePageFaqComponent,
            },
            {
              path: 'privacy-policy',
              component: PrivacyPolicyComponent,
            },
            {
              path: 'terms-conditions',
              component: TermsConditionsComponent,
            },
            {
              path: 'sign-in',
              component: SignInComponent,
            },
            {
              path: 'admission-form',
              component: AdmissionFormComponent,
            },
            {
              path: 'admission-form/:p1',
              component: AdmissionFormComponent,
            },
            {
              path: 'google-maps',
              component: GoogleMapsComponent,
            },
          ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class HomeRoutingModule { }


export const routedComponents = [
    HomeComponent,
    CapIndexComponent,
    SmartsatComponent,
    OurProgramsComponent,
    Cap360Component,
    BootcampComponent,
    HomeWhyCapComponent,
    WhoWeAreComponent,
    TeamComponent,
    GalleryComponent,
    HomeContactUsComponent,
    ProgramsComponent,
    HomePageFaqComponent,
    PrivacyPolicyComponent,
    TermsConditionsComponent,
    SignInComponent,
    AdmissionFormComponent,
    GoogleMapsComponent
  ];
