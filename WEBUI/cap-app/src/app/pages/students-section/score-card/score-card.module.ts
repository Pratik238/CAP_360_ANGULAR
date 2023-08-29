import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppCommonModule } from 'src/app/app.common.module';

import { routedComponents, ScoreCardRoutingModule } from './score-card.routing.module';

@NgModule({
  imports: [
    CommonModule,
    ScoreCardRoutingModule,
    AppCommonModule,
  ],
  declarations: [
    ...routedComponents
  ]
})
export class ScoreCardModule { }
