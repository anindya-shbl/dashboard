import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RadiologyTestsComponent } from './radiology-tests.component';
import { AllRadiologyTestsComponent } from './all-radiology-tests/all-radiology-tests.component';

const routes: Routes = [
  {
    path: '',
    component: RadiologyTestsComponent,
    children: [
      { path: '', component: AllRadiologyTestsComponent },
      // { path: ':parmalink', component: HealthPackagesDetailsComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RadiologyTestsRoutingModule { }
