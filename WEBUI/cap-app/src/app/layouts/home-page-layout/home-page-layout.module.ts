import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgPrimeModule } from 'src/app/app.ngprime.module';
import { HomePageNavComponent } from './home-page-nav/home-page-nav.component';
import { HomePageFooterComponent } from './home-page-footer/home-page-footer.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    NgbModule,
    NgPrimeModule
  ],
  declarations: [
    HomePageNavComponent,
    HomePageFooterComponent
  ],
  exports: [
    HomePageNavComponent,
    HomePageFooterComponent
  ]
})
export class HomePageLayoutModule { }
