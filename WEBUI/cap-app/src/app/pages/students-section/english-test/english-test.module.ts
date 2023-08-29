import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppCommonModule } from 'src/app/app.common.module';

import { EnglishTestComponent } from './english-test.component';
import { EnglishTestRoutingModule, routedComponents } from './english-test.routing.module';

@NgModule({
  imports: [
    CommonModule,
    EnglishTestRoutingModule,
    AppCommonModule
  ],
  declarations: [
    ...routedComponents
  ]
})
export class EnglishTestModule { }
