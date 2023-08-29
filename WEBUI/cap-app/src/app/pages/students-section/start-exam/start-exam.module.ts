import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AppCommonModule } from 'src/app/app.common.module';
import { StartExamRoutingModule } from './start-exam.routing';
import { StartExamComponent } from './start-exam.component';
import { NgxSpinnerModule } from 'ngx-spinner';
import { DataProvider } from 'src/app/helpers/providers/data.provider';

@NgModule({
  imports: [
    CommonModule,
    StartExamRoutingModule,
    AppCommonModule,
    NgxSpinnerModule,
  ],
  declarations: [StartExamComponent],
  exports: [StartExamComponent],
  providers: [ DataProvider ]
})
export class StartExamModule { }
