import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { routedComponents, TuitionRoutingModule } from './tuition.routing.module';
import { AppCommonModule } from 'src/app/app.common.module';

@NgModule({
  imports: [
    CommonModule,
    TuitionRoutingModule,
    AppCommonModule,
  ],
  declarations: [
    ...routedComponents
  ]
})
export class TuitionModule { }
