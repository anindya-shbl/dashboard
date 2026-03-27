import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DiagnosticTestComponent } from './diagnostic-test.component';
import { AllDiagnosticsComponent } from './all-diagnostics/all-diagnostics.component';
import { HealthConditionsComponent } from './health-conditions/health-conditions.component';
import { OrgansComponent } from './organs/organs.component';

const routes: Routes = [
  {
    path: '',
    component: DiagnosticTestComponent,
    children: [
      { path: '', component: AllDiagnosticsComponent },
      { path: 'health-condition/:parmalink', component: HealthConditionsComponent },
      { path: 'organ/:parmalink', component: OrgansComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DiagnosticTestRoutingModule { }
