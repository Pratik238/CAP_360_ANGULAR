import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppCommonModule } from 'src/app/app.common.module';

import { FaqComponent } from './faq.component';
import { FaqRoutingModule } from './faq.routing.module';

@NgModule({
  imports: [
    CommonModule,
    FaqRoutingModule,
    AppCommonModule
  ],
  declarations: [FaqComponent]
})
export class FaqModule { }
