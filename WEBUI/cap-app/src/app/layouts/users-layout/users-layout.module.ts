import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MenuComponent } from './menu/menu.component';
import { HeaderComponent } from './header/header.component';
import { NgPrimeModule } from 'src/app/app.ngprime.module';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    NgbModule,
    NgPrimeModule
  ],
  declarations: [
    MenuComponent,
    HeaderComponent
  ],
  exports: [
    MenuComponent,
    HeaderComponent
  ]
})
export class UsersLayoutModule { }
