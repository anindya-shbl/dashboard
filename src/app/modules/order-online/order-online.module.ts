import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OrderOnlineRoutingModule } from './order-online-routing.module';
import { OrderOnlineComponent } from './order-online.component';
import { OnlineHomeComponent } from './online-home/online-home.component';
import { OnlineFooterComponent } from './online-footer/online-footer.component';
import { SharedModule } from '../shared/shared.module';
import { OnlineSliderComponent } from './online-slider/online-slider.component';
import { CarouselModule } from 'ngx-owl-carousel-o';


@NgModule({
  declarations: [
    OrderOnlineComponent,
    OnlineHomeComponent,
    OnlineFooterComponent,
    OnlineSliderComponent
  ],
  imports: [
    CommonModule,
    OrderOnlineRoutingModule,
    SharedModule,
    CarouselModule
  ]
})
export class OrderOnlineModule { }
