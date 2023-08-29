import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { StartExamComponent } from './start-exam.component';

const routes: Routes = [
    {
        path: '',
        component: StartExamComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class StartExamRoutingModule { }
