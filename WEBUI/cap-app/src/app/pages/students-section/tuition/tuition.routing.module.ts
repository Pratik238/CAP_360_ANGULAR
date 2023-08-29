import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EnglishHomeworkTestComponent } from './home-work/english-homework-test/english-homework-test.component';

import { HomeWorkComponent } from './home-work/home-work.component';
import { HomeworkTestComponent } from './home-work/homework-test/homework-test.component';
import { OnlineClassComponent } from './online-class/online-class.component';
import { TuitionComponent } from './tuition.component';
import { VideosComponent } from './videos/videos.component';


const routes: Routes = [
  {
    path: '',
    redirectTo: 'tuition'
  },
  {
    path: 'tuition',
    component: TuitionComponent,
    children: [
      {
        path: 'online-class',
        component: OnlineClassComponent
      },
      {
        path: 'home-work',
        component: HomeWorkComponent
      },
      {
        path: 'homework-test',
        component: HomeworkTestComponent
      },
      {
        path: 'english-homework-test',
        component: EnglishHomeworkTestComponent
      },
      {
        path: 'videos',
        component: VideosComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TuitionRoutingModule {

}

export const routedComponents = [
  TuitionComponent,
  OnlineClassComponent,
  HomeWorkComponent,
  VideosComponent,
  HomeworkTestComponent,
  EnglishHomeworkTestComponent
];
