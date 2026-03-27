import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DiagnosticTestRoutingModule } from './diagnostic-test-routing.module';
import { DiagnosticTestComponent } from './diagnostic-test.component';
import { AllDiagnosticsComponent } from './all-diagnostics/all-diagnostics.component';
import { OrgansComponent } from './organs/organs.component';
import { HealthConditionsComponent } from './health-conditions/health-conditions.component';
import { SharedModule } from '../shared/shared.module';


@NgModule({
  declarations: [
    DiagnosticTestComponent,
    AllDiagnosticsComponent,
    OrgansComponent,
    HealthConditionsComponent
  ],
  imports: [
    CommonModule,
    DiagnosticTestRoutingModule,
    SharedModule
  ]
})
export class DiagnosticTestModule { }
