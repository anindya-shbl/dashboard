import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HealthPackagesRoutingModule } from './health-packages-routing.module';
import { HealthPackagesComponent } from './health-packages.component';
import { SharedModule } from '../shared/shared.module';
import { AllHealthPackagesComponent } from './all-health-packages/all-health-packages.component';
import { HealthPackagesDetailsComponent } from './health-packages-details/health-packages-details.component';


@NgModule({
  declarations: [
    HealthPackagesComponent,
    AllHealthPackagesComponent,
    HealthPackagesDetailsComponent
  ],
  imports: [
    CommonModule,
    HealthPackagesRoutingModule,
    SharedModule
  ]
})
export class HealthPackagesModule { }
