import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RadiologyTestsRoutingModule } from './radiology-tests-routing.module';
import { RadiologyTestsComponent } from './radiology-tests.component';
import { SharedModule } from '../shared/shared.module';
import { AllRadiologyTestsComponent } from './all-radiology-tests/all-radiology-tests.component';


@NgModule({
  declarations: [
    RadiologyTestsComponent,
    AllRadiologyTestsComponent
  ],
  imports: [
    CommonModule,
    RadiologyTestsRoutingModule,
    SharedModule
  ]
})
export class RadiologyTestsModule { }
