import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ActTutoringComponent } from './test-prep/act-tutoring/act-tutoring.component';
import { ApTutoringComponent } from './test-prep/ap-tutoring/ap-tutoring.component';
import { BootcampComponent } from './test-prep/bootcamp/bootcamp.component';
import { SatTutoringComponent } from './test-prep/sat-tutoring/sat-tutoring.component';
import { TestPrepComponent } from './test-prep/test-prep.component';
import { TutoringComponent } from './tutoring.component';

const routes: Routes = [
    {
        path: '',
        redirectTo: 'tutoring'
    },
    {
        path: 'tutoring',
        component: TutoringComponent,
        children: [
            {
                path: 'test-prep',
                component: TestPrepComponent,
                children: [
                    {
                        path: 'act',
                        component: ActTutoringComponent
                    },
                    {
                        path: 'ap',
                        component: ApTutoringComponent
                    },
                    {
                        path: 'sat',
                        component: SatTutoringComponent
                    },
                    {
                        path: 'bootcamp',
                        component: BootcampComponent
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
export class TutoringRoutingModule {

 }

export const routedComponents = [
    TutoringComponent,
    TestPrepComponent,
    ActTutoringComponent,
    ApTutoringComponent,
    SatTutoringComponent,
    BootcampComponent
 ];
