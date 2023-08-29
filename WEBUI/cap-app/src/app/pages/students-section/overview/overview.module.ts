import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OverviewRoutingModule, routedComponents } from './overview.routing.module';
import { AppCommonModule } from 'src/app/app.common.module';

@NgModule({
  imports: [
    CommonModule,
    OverviewRoutingModule,
    AppCommonModule,
  ],
  declarations: [ ...routedComponents]
})
export class OverviewModule { }
