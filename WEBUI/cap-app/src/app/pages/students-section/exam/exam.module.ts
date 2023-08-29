import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppCommonModule } from 'src/app/app.common.module';

import { ExamRoutingModule } from './exam.routing';
import { ExamComponent } from './exam.component';
import { ChartModule } from 'primeng/chart';

@NgModule({
  imports: [
    CommonModule,
    ExamRoutingModule,
    AppCommonModule,
    ChartModule
  ],
  declarations: [ExamComponent]
})
export class ExamModule { }
