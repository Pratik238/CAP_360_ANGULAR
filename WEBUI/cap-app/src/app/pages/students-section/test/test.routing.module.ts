import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { JumbleEnglishTestComponent } from './jumble-test/jumble-english-test/jumble-english-test.component';
import { JumbleMathsTestComponent } from './jumble-test/jumble-maths-test/jumble-maths-test.component';
import { JumbleTestComponent } from './jumble-test/jumble-test.component';
import { EnglishComponent } from './practice/english/english.component';
import { MathsComponent } from './practice/maths/maths.component';
import { PracticeComponent } from './practice/practice.component';
import { EnglishSatExamComponent } from './sat-test/english-sat-exam/english-sat-exam.component';
import { MathSatExamComponent } from './sat-test/math-sat-exam/math-sat-exam.component';
import { SatTestComponent } from './sat-test/sat-test.component';
import { TestComponent } from './test.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'test'
  },
  {
    path: 'test',
    component: TestComponent,
    children: [
      {
        path: 'practice',
        component: PracticeComponent,
        children: [
            {
                path: 'maths',
                component: MathsComponent
            },
            {
                path: 'english',
                component: EnglishComponent
            }
        ]
      },
      {
        path: 'sat-test',
        component: SatTestComponent,
        children: [
          {
              path: 'maths-sat',
              component: MathSatExamComponent
          },
          {
              path: 'english-sat',
              component: EnglishSatExamComponent
          }
      ]
      },
      {
        path: 'Jumble-test',
        component: JumbleTestComponent,
        children: [
          {
              path: 'maths-test',
              component: JumbleMathsTestComponent
          },
          {
              path: 'english-test',
              component: JumbleEnglishTestComponent
          }
      ]
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TestRoutingModule {

}

export const routedComponents = [
    TestComponent,
    SatTestComponent,
    PracticeComponent,
    EnglishComponent,
    MathsComponent,
    MathSatExamComponent,
    EnglishSatExamComponent,
    JumbleTestComponent,
    JumbleEnglishTestComponent,
    JumbleMathsTestComponent

];
