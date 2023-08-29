import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppCommonModule } from 'src/app/app.common.module';

import { ContactUsRoutingModule } from './contactus.routing.module';
import { ContactusComponent } from './contactus.component';

@NgModule({
  imports: [
    CommonModule,
    ContactUsRoutingModule,
    AppCommonModule
  ],
  declarations: [
    ContactusComponent
  ]
})
export class ContactUsModule { }
