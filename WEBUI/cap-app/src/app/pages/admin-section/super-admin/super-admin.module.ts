import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppCommonModule } from 'src/app/app.common.module';
import { SuperAdminRoutingModule } from './super-admin.routing.module';
import { routedComponents } from '../../admin-section/super-admin/super-admin.routing.module';

@NgModule({
  imports: [
    CommonModule,
    SuperAdminRoutingModule,
    AppCommonModule,
  ],
  declarations: [
      ...routedComponents
  ]
})
export class SuperAdminModule { }
