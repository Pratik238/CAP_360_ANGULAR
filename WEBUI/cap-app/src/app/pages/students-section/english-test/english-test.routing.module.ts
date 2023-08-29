import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EnglishTestComponent } from './english-test.component';

const routes: Routes = [
    {
        path: '',
        component: EnglishTestComponent,
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class EnglishTestRoutingModule { }

export const routedComponents = [
    EnglishTestComponent
  ];
