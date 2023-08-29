import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ExamResultQuestionsComponent } from './exam-result-questions.component';


const routes: Routes = [
    {
        path: 'exam-result-questions',
        component: ExamResultQuestionsComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ExamResultQuestionsRoutingModule { }
