import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeRoutingModule, routedComponents } from './home.routing.module';
import { SlickCarouselModule } from 'ngx-slick-carousel';
import { AppCommonModule } from '../../app.common.module';


@NgModule({
  imports: [
    CommonModule,
    HomeRoutingModule,
    AppCommonModule,
    SlickCarouselModule
  ],
  declarations: [
    ...routedComponents
  ]
})
export class HomeModule { }
