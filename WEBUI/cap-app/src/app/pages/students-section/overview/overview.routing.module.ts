import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AboutCapComponent } from './about-cap/about-cap.component';
import { CapBasicInfoComponent } from './cap-basic-info/cap-basic-info.component';
import { OverviewComponent } from './overview.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'overview'
  },
  {
    path: 'overview',
    component: OverviewComponent,
    children: [
      {
        path: 'cap-basic-info',
        component: CapBasicInfoComponent
      },
      {
        path: 'about-cap',
        component: AboutCapComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OverviewRoutingModule {

}

export const routedComponents = [
  OverviewComponent,
  CapBasicInfoComponent,
  AboutCapComponent
];
