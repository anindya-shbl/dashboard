import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LabHomeRoutingModule } from './lab-home-routing.module';
import { LabHomeComponent } from './lab-home.component';
import { SharedModule } from '../shared/shared.module';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { LabLandingComponent } from './lab-landing/lab-landing.component';
import { HomePackagesComponent } from './home-packages/home-packages.component';
import { HomeTestsComponent } from './home-tests/home-tests.component';
import { HomeOrgansComponent } from './home-organs/home-organs.component';
import { HomeHealthconditionsComponent } from './home-healthconditions/home-healthconditions.component';
import { HowItWorksComponent } from './how-it-works/how-it-works.component';


@NgModule({
  declarations: [
    LabHomeComponent,
    LabLandingComponent,
    HomePackagesComponent,
    HomeTestsComponent,
    HomeOrgansComponent,
    HomeHealthconditionsComponent,
    HowItWorksComponent
  ],
  imports: [
    CommonModule,
    LabHomeRoutingModule,
    SharedModule,
    CarouselModule
  ]
})
export class LabHomeModule { }
