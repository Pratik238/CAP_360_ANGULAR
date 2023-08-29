import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EnglishScorecardQuestionsComponent } from './english-scorecard-questions/english-scorecard-questions.component';
import { JumbleTestReportComponent } from './jumble-test-report/jumble-test-report.component';

import { PracticeTestReportComponent } from './practice-test-report/practice-test-report.component';
import { SatTestReportComponent } from './sat-test-report/sat-test-report.component';
import { ScoreCardQuestionsComponent } from './score-card-questions/score-card-questions.component';
import { ScoreCardComponent } from './score-card.component';

const routes: Routes = [
    {
        path: '',
        redirectTo: 'score-card'
    },
    {
        path: 'score-card',
        component: ScoreCardComponent,
        children: [
            {
              path: 'practice-test',
              component: PracticeTestReportComponent,
            },
            {
              path: 'sat-report',
              component: SatTestReportComponent
            },
            {
              path: 'test-questions',
              component: ScoreCardQuestionsComponent
            },
            {
              path: 'english-test-questions',
              component: EnglishScorecardQuestionsComponent
            },
            {
              path: 'jumble-test-report',
              component: JumbleTestReportComponent
            }
          ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ScoreCardRoutingModule { }

export const routedComponents = [
    ScoreCardComponent,
    SatTestReportComponent,
    PracticeTestReportComponent,
    ScoreCardQuestionsComponent,
    EnglishScorecardQuestionsComponent,
    JumbleTestReportComponent
  ];
