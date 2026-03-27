import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HealthPackagesComponent } from './health-packages.component';
import { AllHealthPackagesComponent } from './all-health-packages/all-health-packages.component';
import { HealthPackagesDetailsComponent } from './health-packages-details/health-packages-details.component';

const routes: Routes = [
  {
    path: '',
    component: HealthPackagesComponent,
    children: [
      { path: '', component: AllHealthPackagesComponent },
      { path: ':parmalink', component: HealthPackagesDetailsComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HealthPackagesRoutingModule { }
