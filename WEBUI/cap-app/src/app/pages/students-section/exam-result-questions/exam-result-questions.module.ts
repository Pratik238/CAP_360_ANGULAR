import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppCommonModule } from 'src/app/app.common.module';

import { ExamResultQuestionsRoutingModule } from './exam-result-questions.routing.module';
import { ExamResultQuestionsComponent } from './exam-result-questions.component';


@NgModule({
  imports: [
    CommonModule,
    ExamResultQuestionsRoutingModule,
    AppCommonModule
  ],
  declarations: [ExamResultQuestionsComponent]
})
export class ExamResultQuestionsModule { }
