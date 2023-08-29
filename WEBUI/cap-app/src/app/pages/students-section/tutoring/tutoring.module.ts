import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AppCommonModule } from 'src/app/app.common.module';
import { routedComponents, TutoringRoutingModule } from './tutoring.routing.module';

@NgModule({
  imports: [
    CommonModule,
    TutoringRoutingModule,
    AppCommonModule,
  ],
  declarations: [
      ...routedComponents
    ],
  exports: []
})
export class TutoringModule { }
