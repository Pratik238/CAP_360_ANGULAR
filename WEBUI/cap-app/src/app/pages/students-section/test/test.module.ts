import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { routedComponents, TestRoutingModule } from './test.routing.module';
import { AppCommonModule } from 'src/app/app.common.module';

@NgModule({
  imports: [
    CommonModule,
    TestRoutingModule,
    AppCommonModule,
  ],
  declarations: [
      ...routedComponents
  ]
})
export class TestModule { }
